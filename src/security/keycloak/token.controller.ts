import { Controller, Get, Query, Res} from '@nestjs/common';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { keycloakConnectOptions } from '../../config/keycloak.js';
import { KeycloakAdminService } from './keycloak-admin.service.js';
import { Public } from 'nest-keycloak-connect';

const { authServerUrl, realm } = keycloakConnectOptions;

@Controller()
export class EmailVerificationController {

    readonly #keycloakService: KeycloakAdminService;

    constructor(keycloakService: KeycloakAdminService) {
        this.#keycloakService = keycloakService;
    }

    @Get('/verify-email')
    @Public()
    async verifyEmail(

        @Query('token') token: string,
        @Res() res: Response,
    ): Promise<void> {
        try {

            console.log('E-Mail-Verifizierung gestartet mit Token:', token);
            // 🔐 Token prüfen & userId extrahieren
            const payload = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET!) as {
                userId: string;
                email?: string;
            };

            const userId = payload.userId;
            if (!userId) throw new Error('Ungültiger Token: Kein User ID enthalten');

            // 🔑 Keycloak Admin Access Token holen
            const adminToken = await this.#keycloakService.getAdminToken();
            console.log('authServerUrl:', authServerUrl);

            // 📬 Keycloak: E-Mail als bestätigt markieren
            await axios.put(
                `${authServerUrl}/admin/realms/${realm}/users/${userId}`,
                { emailVerified: true },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // ✅ Erfolgreich → Weiterleitung
            return res.redirect(process.env.EMAIL_VERIFICATION_LINK);
        } catch (err) {
            console.error('E-Mail-Verifizierung fehlgeschlagen:', err);
            return res.redirect('/email-verification-failed');
        }
    }
}
