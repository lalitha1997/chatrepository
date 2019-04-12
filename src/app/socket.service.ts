import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable } from 'rxjs/Observable';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable()
export class SocketService {

  private url = 'https://chatapi.edwisor.com';

  private socket;


  constructor(public http: HttpClient) {
    
    this.socket = io(this.url);

  }

  
  public verifyUser = () => {

    return Observable.create((observer) => {

      this.socket.on('verifyUser', (data) => {

        observer.next(data);

      }); 

    }); 

  } 

  public onlineUserList = () => {

    return Observable.create((observer) => {

      this.socket.on("online-user-list", (userList) => {

        observer.next(userList);

      }); 

    }); 

  } 

  public disconnectedSocket = () => {

    return Observable.create((observer) => {

      this.socket.on("disconnect", () => {

        observer.next();

      }); 

    }); 


  } 

  

  public setUser = (authToken) => {

    this.socket.emit("set-user", authToken);

  } 

  public markChatAsSeen = (userDetails) => {

    this.socket.emit('mark-chat-as-seen', userDetails);

  } 
  

  public getChat(senderId, receiverId, skip): Observable<any> {

    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authtoken')}`)
      .do(data => console.log('Data Received'))
      .catch(this.handleError);

  } 

  public chatByUserId = (userId) => {

    return Observable.create((observer) => {
      
      this.socket.on(userId, (data) => {

        observer.next(data);

      }); 
    }); 

  } 

  public SendChatMessage = (chatMsgObject) => {

    this.socket.emit('chat-msg', chatMsgObject);

  } 


  public exitSocket = () =>{


    this.socket.disconnect();


  }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } 

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  
}
