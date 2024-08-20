import firebase from 'firebase/compat/app';
export default interface IClip{
  uid: string,
  displayName: string,
  title: string,
  fileName: string,
  clipURL: string,
  screenshotURL: string,
  screenshotFileName: string,
  timestamp: firebase.firestore.FieldValue,
  docID?: string
}
