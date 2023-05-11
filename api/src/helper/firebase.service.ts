import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
    constructor() {
        if (!this.firebase) {
            this.firebase = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                })
            })
        }
    }

    private firebase: admin.app.App;

    getInstance(): admin.app.App {
        return this.firebase;
    }
}