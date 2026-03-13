import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-video-tutorials',
  templateUrl: './video-tutorials.component.html',
  styleUrls: ['./video-tutorials.component.scss']
})
export class VideoTutorialsComponent implements OnInit {
  title:string="Mutra";
  user: any;
  playingVideo: any = null;

playVideo(video: any) {
  this.playingVideo = video;
}

videos = [
  {
    ids:0,
    title: 'Morning Yoga Flow',
    url: 'https://www.youtube.com/embed/LqXZ628YNj4',
    thumbnail: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800'
  },
  {
    ids:1,
    title: 'Meditation Basics',
    url: 'https://www.youtube.com/embed/ZToicre_6pg',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
  },
  {
    ids:2,
    title: 'Strength Training Yoga',
    url: 'https://www.youtube.com/embed/ml6cT4AZdqI',
    thumbnail: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800'
  },
  {
    ids:3,
    title: 'Beginner Yoga Stretch',
    url: 'https://www.youtube.com/embed/v7AYKMP6rOE',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800'
  },
  {
    ids:4,
    title: 'Power Yoga Workout',
    url: 'https://www.youtube.com/embed/r7xsYgTeM2Q',
    thumbnail: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800'
  },
  {
    ids:5,
    title: '20 Minute Full Body Yoga',
    url: 'https://www.youtube.com/embed/inpok4MKVLM',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
  },
  {
    ids:6,
    title: 'Relaxing Evening Yoga',
    url: 'https://www.youtube.com/embed/b1H3xO3x_Js',
    thumbnail: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800'
  },
  {
    ids:7,
    title: 'Yoga for Flexibility',
    url: 'https://www.youtube.com/embed/sTANio_2E0Q',
    thumbnail: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=800'
  },
  {
    ids:8,
    title: 'Deep Stretch Yoga',
    url: 'https://www.youtube.com/embed/oBu-pQG6sTY',
    thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800'
  },
  {
    ids:9,
    title: 'Yoga for Stress Relief',
    url: 'https://www.youtube.com/embed/hJbRpHZr_d0',
    thumbnail: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'
  },
  {
    ids:10,
    title: 'Morning Mobility Yoga',
    url: 'https://www.youtube.com/embed/T41mYCmtWls',
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800'
  },
  {
    ids:11,
    title: 'Yoga for Beginners at Home',
    url: 'https://www.youtube.com/embed/2pLT-olgUJs',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
  },
  {
    ids:12,
    title: 'Yoga for Back Pain',
    url: 'https://www.youtube.com/embed/phuS5VLQy8c',
    thumbnail: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800'
  },
  {
    ids:13,
    title: 'Daily Yoga Routine',
    url: 'https://www.youtube.com/embed/--jhKVdZOJM',
    thumbnail: 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800'
  },
  {
    ids:14,
    title: 'Yoga for Balance',
    url: 'https://www.youtube.com/embed/QS2yDmWk0vs',
    thumbnail: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=800'
  },
  {
    ids:15,
    title: 'Morning Stretch Yoga',
    url: 'https://www.youtube.com/embed/UEEsdXn8oG8',
    thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800'
  },
  {
    ids:16,
    title: 'Gentle Yoga Flow',
    url: 'https://www.youtube.com/embed/xW7jQ7vY5tY',
    thumbnail: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'
  },
  {
    ids:17,
    title: 'Full Body Relaxation Yoga',
    url: 'https://www.youtube.com/embed/8TuRYV71Rgo',
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800'
  }
];

  constructor(
    private auth: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.user = this.auth.getUserDetails();
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  alerting(){
    alert("Click the play button buddy...!");
  }
}