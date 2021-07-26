import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';



import { Observable, of, throwError } from 'rxjs';




@Injectable()
export class SocialShareService  {

  constructor(public http: Http, 
        public file: File,
        private filePath: FilePath,
        public socialSharing: SocialSharing,
	public storage: Storage) {

  }

   async shareEmail(message, subject, emailarray, imagelink) {

    this.socialSharing.shareViaEmail(message, subject, emailarray, null, null, imagelink  ).then(()=> {

    alert('Share success');
    }).catch(e=> {
    alert('Share fail'+ e);

    })

  }


   async socialSharingQrImage(message, imageqr, linkurl) {
    // Check if sharing via email is supported
 let data = await this.imageextract(imageqr) ;
  //alert(data.nativeURL);
    this.socialSharing.share(message, null, data.nativeURL , linkurl).then(() => {
      console.log('share success');
    }).catch(() => {
      console.log('share failed');

    });
  }

   async imageextract(imageqr) {
  var data = await imageqr.toDataURL(); //this.myqr.toDataURL();

  let img64: string  = data.substr(0, data.length - 2).split('base64,')[1];
   //alert(img64);
  var image = this.b64toBlob(img64, 'image/png');
  return this.resolveCreatedFile(image) ;

 }

  async resolveCreatedFile(image: any) {

   return this.file.writeFile(this.file.cacheDirectory, "test.png", image,  {replace:true});
 }


   async socialSharingAnything(message, imagelink, linkurl) {
    // Check if sharing via email is supported

    this.socialSharing.share(message, null, imagelink , linkurl).then(() => {
      console.log('share success');
    }).catch(() => {
      console.log('share failed');

    });
  }


  async socialSharingAnythingOnMobile(resolvedlocalfile, message, linkurl ) {
    // Check if sharing via email is supported

   // let data = await this.resolveLocalFile();

    this.socialSharing.share(message, null, resolvedlocalfile.nativeURL , linkurl).then(() => {
      console.log('share success');
      // Sharing via email is possible
    }).catch(() => {
      console.log('share failed');

      // Sharing via email is not possible
    });
  }

   b64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }


}
