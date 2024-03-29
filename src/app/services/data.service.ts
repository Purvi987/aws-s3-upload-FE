import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Firestore, addDoc, collection, collectionData, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private fireStore: Firestore) {}

  addData(data: any) {
    data.id = doc(collection(this.fireStore, 'id')).id;
    return addDoc(collection(this.fireStore, 'ImageInfo'), data)
  }

  getdata() : Observable<[]> {
    const ref = collection(this.fireStore, 'ImageInfo');
    return collectionData(ref, {idField:'id'}) as Observable<[]>
  }
}
