import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiveStreamService {
  private hubConnection: signalR.HubConnection;
  public newStream$ = new Subject<{peerId: string, userName: string}>();
  public streamClosed$ = new Subject<string>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7205/streamHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('StreamStarted', (peerId: string, userName: string) => {
      this.newStream$.next({ peerId, userName });
    });

    this.hubConnection.on('StreamStopped', (peerId: string) => {
      this.streamClosed$.next(peerId);
    });

    this.startConnection();
  }

  private async startConnection() {
    try {
      await this.hubConnection.start();
    } catch (err) {
      console.error(err);
    }
  }

  announceStream(peerId: string, userName: string) {
    this.hubConnection.invoke('NotifyStreamStarted', peerId, userName);
  }

  stopStreamNotification(peerId: string) {
    this.hubConnection.invoke('NotifyStreamEnded', peerId);
  }
}