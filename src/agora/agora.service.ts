import { Request, RequestHandler, Response } from 'express';
import { RtcTokenBuilder, RtcRole, RtmTokenBuilder, RtmRole } from "agora-access-token";

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

export const generateRTCToken = async (res: Response, channelName: string, role: string, tokenType: string, uid: string, expiry: string) => {
    // set response header
    res.header('Acess-Control-Allow-Origin', '*');

    // get channel name
    if (!channelName) {
        return res.status(500).json({ 'error': 'channel is required' });
    }
    // get uid 
    if (!uid || uid === '') {
        return res.status(500).json({ 'error': 'uid is required' });
    }
    // get role
    let _role;
    if (role === 'publisher') {
        _role = RtcRole.PUBLISHER;
    } else if (role === 'audience') {
        _role = RtcRole.SUBSCRIBER
    } else {
        return res.status(500).json({ 'error': 'role is incorrect' });
    }
    // get the expire time
    let expireTime
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        try {
            expireTime = parseInt(expiry as string, 10);
        } catch (e) {
            return res.status(500).json({ 'error': 'expiry is incorrect ' + JSON.stringify(e) });
        }
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    let token;
    if (tokenType === 'userAccount') {
        token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, _role, privilegeExpireTime);
    } else if (tokenType === 'uid') {
        token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, parseInt(uid, 10), _role, privilegeExpireTime);
    } else {
        return res.status(500).json({ 'error': 'token type is invalid' });
    }
    // return the token
    return ({ 'appId': APP_ID, 'channelName': channelName, 'rtcToken': token });
}

export const generateRTMToken = async (res: Response, uid: string, expiry: string) => {
    // set response header
    res.header('Acess-Control-Allow-Origin', '*');

    // get uid 
    if (!uid || uid === '') {
        return res.status(500).json({ 'error': 'uid is required' });
    }
    // get role
    let role = RtmRole.Rtm_User;
    // get the expire time
    let expireTime
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        try {
            expireTime = parseInt(expiry as string, 10);
        } catch (e) {
            return res.status(500).json({ 'error': 'expiry is incorrect ' + JSON.stringify(e) });
        }
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    console.log(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime)
    const token = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, role, privilegeExpireTime);
    // return the token
    return ({ 'appId': APP_ID, 'rtmToken': token });
}

export const generateRTEToken = async (res: Response, channelName: string, role: string, tokenType: string, uid: string, expiry: string) => {
    // set response header
    res.header('Acess-Control-Allow-Origin', '*');
    // get channel name
    if (!channelName) {
        return res.status(500).json({ 'error': 'channel is required' });
    }
    // get uid 
    if (!uid || uid === '') {
        return res.status(500).json({ 'error': 'uid is required' });
    }
    // get role
    let _role;
    if (role === 'publisher') {
        _role = RtcRole.PUBLISHER;
    } else if (role === 'audience') {
        _role = RtcRole.SUBSCRIBER
    } else {
        return res.status(500).json({ 'error': 'role is incorrect' });
    }
    // get the expire time
    let expireTime
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        try {
            expireTime = parseInt(expiry as string, 10);
        } catch (e) {
            return res.status(500).json({ 'error': 'expiry is incorrect ' + JSON.stringify(e) });
        }
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, parseInt(uid, 10), _role, privilegeExpireTime);
    const rtmToken = RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATE, uid, _role, privilegeExpireTime);
    // return the token
    return ({ 'appId': APP_ID, 'channelName': channelName, 'rtcToken': rtcToken, 'rtmToken': rtmToken });
}