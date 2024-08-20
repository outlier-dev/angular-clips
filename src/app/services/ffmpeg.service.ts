import { Injectable } from '@angular/core';
import {createFFmpeg} from "@ffmpeg/ffmpeg";

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady: false;
  private ffmpeg;
  constructor() {
    this.ffmpeg = createFFmpeg()
  }
}
