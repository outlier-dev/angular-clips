import { Component, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/compat/storage";
import {v4 as uuid} from 'uuid'
import { switchMap } from "rxjs/operators";
import { AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import { ClipService } from "../../services/clip.service";
import {Router} from "@angular/router";
import {FfmpegService} from "../../services/ffmpeg.service";
import {combineLatest, forkJoin} from "rxjs";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnDestroy{

  constructor(
    private storage:AngularFireStorage,
    private auth:AngularFireAuth,
    private clipsService:ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe( user => this.user = user)
    this.ffmpegService.init()
  }

  isDragover = false;
  videoIsUploaded = false;
  file: File | null = null;
  user: firebase.User | null = null;
  inSubmission = false;

  title= new FormControl('', {
    validators:[
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  showAlert = false;
  showPercentage = false;
  alertMsg = 'Please wait! Your form is processing';
  alertColor = 'blue';

  percentage = 0;

  videoUploadForm = new FormGroup({
    title: this.title,
  },);

  task?:AngularFireUploadTask;

  screenshots: string[] = [];
  selectedScreenshot = '';

  screenshotTask?:AngularFireUploadTask;

  ngOnDestroy() {
    this.task?.cancel()
  }

  async uploadVideo(){
    this.showAlert = true;
    this.inSubmission = true;
    try {
      this.inSubmission = false;
    }
    catch (error){
      console.log(error);
      this.alertMsg = 'Something goes wrong';
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }
    this.alertMsg = 'Your form processed successfully!';
    this.alertColor = 'green';
  }

  async storeFile($event: Event){
    if(this.ffmpegService.isRunning){
      return
    }

    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null : ($event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4'){
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)
    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/,'')
    );
    this.uploadFile()
    this.videoIsUploaded = true;
  }

  async uploadFile(){
    this.videoUploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = `Please wait! Your clip is being uploaded.`;
    this.inSubmission = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot);

    const screenshotPath = `screenshots/${clipFileName}.png`

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.screenshotTask = this.storage.upload(screenshotPath,screenshotBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    this.showPercentage = true
    combineLatest([this.task.percentageChanges(),this.screenshotTask.percentageChanges()]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      if (!clipProgress||!screenshotProgress) return
      const total = clipProgress as number + screenshotProgress as number;
      this.percentage = total/200;
    })

    forkJoin([this.task.snapshotChanges(),this.screenshotTask.snapshotChanges()]).pipe(switchMap(() => forkJoin([clipRef.getDownloadURL(),screenshotRef.getDownloadURL()]))).subscribe({
      next: async (urls) => {
        const[clipUrl, screenshotURL] = urls;
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          screenshotFileName: `${clipFileName}.png`,
          clipURL: clipUrl as string,
          screenshotURL: screenshotURL as string,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipsService.createClip(clip);

        this.alertColor = 'green'
        this.alertMsg = `Congratulations! Upload complete.`
        this.showPercentage = false

        setTimeout(()=>{
          this.router.navigate(['clip',clipDocRef.id])
        },1000)
      },
      error: (error) => {
        this.videoUploadForm.enable();
        this.alertColor = 'red'
        this.alertMsg = `Upload Failed! Please try again later.`
        this.inSubmission = true
        this.showPercentage = false
        console.log(error)
      }
    });
  }

  setSelectedScreenshot(screenshotURL:string){
    this.selectedScreenshot = screenshotURL;
  }

}
