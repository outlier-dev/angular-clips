import {Component, OnInit, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import IClip from "../models/clip.model";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers:[DatePipe]
})
export class ClipComponent implements OnInit{
  @ViewChild('videoPlayer', { static: true}) target?: ElementRef
  player?: Player
  clip?:IClip
  constructor(public route:ActivatedRoute) {
  }

  ngOnInit() {
    this.player = videojs(this.target?.nativeElement)
    this.route.data.subscribe(data => {
      this.clip = data.clip as IClip

      this.player?.src({
        src:this.clip.clipURL,
        type: 'video/mp4'
      })
    })
    // this.id = this.route.snapshot.params.id
  }
}
