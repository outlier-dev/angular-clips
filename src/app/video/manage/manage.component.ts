import {Component, OnInit} from '@angular/core';
import {Router,ActivatedRoute, Params} from "@angular/router";
import { ClipService} from "../../services/clip.service";
import IClip from "../../models/clip.model";
import {ModalService} from "../../services/modal.service";
import {BehaviorSubject} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss'
})
export class ManageComponent implements OnInit{
  sortParam = '1'
  clips: IClip[] = []
  activeClip:IClip | null = null;
  sort$:BehaviorSubject<string>
  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private clipService:ClipService,
    private modal:ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.sortParam);
  }
  sort($event: Event){
    const {value} = ($event.target as HTMLSelectElement);
    // this.router.navigateByUrl(`/manage?sort=${value}`)
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams:{
        sort:value
      }
    })
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params:Params)=>{
      this.sortParam = params.sort === '2' ? params.sort : '1'
      this.sort$.next(this.sortParam)
    })
    this.clipService.getUserClips(this.sort$).subscribe(docs =>{
      this.clips = [];
      docs.forEach(
        doc => {
          this.clips.push({
            docID: doc.id,
            ...doc.data()
          })
        }
      )
    })
    // this.id = this.route.snapshot.params.id
  }

  openModal($event:Event, clip:IClip){
    $event.preventDefault();
    this.activeClip = clip
    this.modal.toggleModal('editClip');
  }

  update($event:IClip){
    this.clips.forEach(
      (element,index)=>{
        if(element.docID === $event.docID){
          element.title = $event.title
        }
      }
    )
  }
  async deleteClip($event:Event, clip:IClip){
    $event.preventDefault();
    await this.clipService.deleteClip(clip);

    this.clips.forEach(
      (element,index)=>{
        if(element.docID === clip.docID){
          this.clips.splice(index,1);
        }
      }
    )
  }

  async copyToClipboard($event:Event,docID:string | undefined){
    $event.preventDefault()
    if (!docID){
      return
    }
    const url = `${location.origin}/clip/${docID}`;

    await navigator.clipboard.writeText(url);

    alert('link copied')
  }
}
