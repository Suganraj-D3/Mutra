import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LiveStreamService } from 'src/app/services/live-stream.service';
import Peer from 'peerjs';
@Component({
  selector: 'app-live-streaming',
  templateUrl: './live-streaming.component.html',
  styleUrls: ['./live-streaming.component.scss']
})
export class LiveStreamingComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  title:string="Mutra";
  peer: any;
  myPeerId: string = '';
  isBroadcasting = false;
  currentStream: MediaStream | null = null;
  availableStreams: any[] = [];
  activeSessionName: string = '';
  constructor(
    private auth: AuthService, 
    private streamService: LiveStreamService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.peer = new Peer({
      config: {
        'iceServers': [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });
    
    this.peer.on('open', (id: string) => {
      this.myPeerId = id;
    });
    this.peer.on('call', (call: any) => {
      call.answer(this.currentStream || undefined); 
      
      call.on('stream', (remoteStream: MediaStream) => {
        this.setupVideo(remoteStream);
      });
    });
    this.streamService.newStream$.subscribe(data => {
      if (data.peerId !== this.myPeerId && !this.availableStreams.find(s => s.peerId === data.peerId)) {
        this.availableStreams.push(data);
        this.cdr.detectChanges();
      }
    });
    this.streamService.streamClosed$.subscribe(peerId => {
      this.availableStreams = this.availableStreams.filter(s => s.peerId !== peerId);
      this.cdr.detectChanges();
    });
  }
  async startBroadcast() {
    try {
      this.currentStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      this.isBroadcasting = true;
      const userName = this.auth.getUserName() || 'Instructor';
      this.activeSessionName = `Live: ${userName}`;
      this.setupVideo(this.currentStream);
      this.streamService.announceStream(this.myPeerId, userName);
    } catch (err) {
      alert('Camera access failed');
    }
  }
  async joinStream(stream: any) {
    this.activeSessionName = `${stream.userName}'s Session`;
    
    try {
      const dummyStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const call = this.peer.call(stream.peerId, dummyStream); 
      
      call.on('stream', (remoteStream: MediaStream) => {
        this.setupVideo(remoteStream);
        dummyStream.getTracks().forEach(track => track.stop());
      });
    } catch (e) {
      const call = this.peer.call(stream.peerId, new MediaStream());
      call.on('stream', (remoteStream: MediaStream) => this.setupVideo(remoteStream));
    }
  }
  private setupVideo(stream: MediaStream) {
    if (this.videoElement && this.videoElement.nativeElement) {
      const video = this.videoElement.nativeElement;
      video.srcObject = stream;
      video.muted = this.isBroadcasting; 
      video.onloadedmetadata = () => {
        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      };
      this.cdr.detectChanges();
    }
  }
  stopBroadcast() {
    if (this.currentStream) {
      this.currentStream.getTracks().forEach(t => t.stop());
      this.currentStream = null;
    }
    if (this.videoElement && this.videoElement.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }
    this.isBroadcasting = false;
    this.activeSessionName = '';
    this.streamService.stopStreamNotification(this.myPeerId);
    this.cdr.detectChanges();
  }
  ngOnDestroy() {
    this.stopBroadcast();
    if (this.peer) this.peer.destroy();
  }
}