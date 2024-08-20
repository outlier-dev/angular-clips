import { Injectable } from '@angular/core';
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private ffmpeg;
  constructor() {
    this.ffmpeg = createFFmpeg({log: true})
  }

  async init(){
    if(this.isReady){
      return
    }

    await this.ffmpeg.load()
    this.isReady = true;
  }


  async getScreenshots(file: File){
    this.isRunning = true;
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);


    const seconds = [1,3,5];
    const commands: string[] = [];

    seconds.forEach( (second, index) => {
      commands.push(
        //Input
        '-i', file.name,
        //Output Options
        '-ss', `00:00:${second.toString().padStart(2, '0')}`,
        '-frames:v', '1',
        '-filter:v','scale=510:-1',
        //Output
        `output_${index.toString().padStart(2, '0')}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    )

    const readFile = (filename:string) => {
      try {
        return this.ffmpeg.FS('readFile',filename);
      }
      catch (e){
        console.log(e)
        return false;
      }
    }

    const screenshots: string[] = [];
    seconds.forEach((second, index)=>{
      const filename = `output_${index.toString().padStart(2, '0')}.png`;
      const screenshotFile = readFile(filename);
      if(screenshotFile){
        const screenshotBlob =  new Blob([screenshotFile.buffer], { type: 'image/png'});
        const screenshotURL = URL.createObjectURL(screenshotBlob);
        screenshots.push( screenshotURL)
      }
    })
    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url:string){
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
