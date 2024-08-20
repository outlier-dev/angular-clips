import {Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import IClip from "../../models/clip.model";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {ClipService} from "../../services/clip.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{
  @Input() activeClip:IClip | null = null;
  @Output() update = new EventEmitter()
  constructor(
    private modal:ModalService,
    private clipService: ClipService
  ) {}

  clipID= new FormControl('',{
    nonNullable: true
  })
  title= new FormControl('', {
    validators:[
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  inSubmission = false;
  showAlert = false;
  alertMsg = 'Please wait! Updating clip...';
  alertColor = 'blue';

  videoEditForm = new FormGroup({
    title: this.title,
    id: this.clipID
  },);

  ngOnInit() {
    this.modal.register("editClip")
  }

  ngOnDestroy() {
    this.modal.unregister("editClip")
  }

  ngOnChanges(changes: SimpleChanges) {
    this.inSubmission = false;
    this.showAlert = false;
    this.alertMsg = 'Please wait! Updating clip...';
    this.alertColor = 'blue';
    if(!this.activeClip){return}
    this.clipID.setValue(this.activeClip.docID ?? '')
    this.title.setValue(this.activeClip.title ?? '')
  }

  async editVideo(){
    if(!this.activeClip){return}
    this.inSubmission = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip...';
    this.showAlert = true;

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value)
    }catch (e){
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something goes wrong! Please try later...';
      console.log('error:', e)
      return
    }
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip)

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Clip was successfully updated!';

  }

}
