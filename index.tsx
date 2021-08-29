import * as AppleAuthentication from 'expo-apple-authentication'
import * as GoogleSignIn from 'expo-auth-session/providers/google'
import * as Facebook from 'expo-facebook'
import * as WebBrowser from 'expo-web-browser'
import React, { useEffect, useState } from 'react'
import { AppState, Image, Platform, TouchableOpacity, View } from 'react-native'
import LoginWithInstagram from './instagram'

const appleLogo = require('./assets/images/apple.png')
const facebookLogo = require('./assets/images/facebook.png')
const googleLogo = require('./assets/images/google.png')
const instagramLogo = require('./assets/images/instagram.png')

WebBrowser.maybeCompleteAuthSession()

type Props = {
  enableInstagram?: boolean
  googleExpoClientId: string
  googleAndroidClientId: string
  googleIosClientId: string
  facebookAppId: string
  instagramAppId?: string
  instagramAppSecret?: string
  instagramRedirectUrl?: string
  onSignInSuccess: (provider: string, token: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}
/**
 * SovTech Core social media login component

 * @param enableInstagram boolean to enable Instagram sign in
 */

const SocialAuth = ({
  enableInstagram,
  googleExpoClientId,
  googleAndroidClientId,
  googleIosClientId,
  facebookAppId,
  instagramAppId,
  instagramAppSecret,
  instagramRedirectUrl,
  onSignInSuccess,
  onError,
  onCancel
}: Props) => {
  const isAndroid = Platform.OS === 'android'

  const [_, response, promptAsync] = GoogleSignIn.useAuthRequest({
    expoClientId: googleExpoClientId,
    androidClientId: googleAndroidClientId,
    iosClientId: googleIosClientId
  })

  const facebookAuth = async () => {
    try {
      await Facebook.initializeAsync({ appId: facebookAppId })
      const { type, token } = (await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email']
      })) as { type: string; token: string | undefined }
      if (type === 'success') {
        return onSignInSuccess('facebook', token as string)
      } else {
        return onError && onError('An unknown error has occured')
      }
    } catch (error) {
      return onError && onError(error.message)
    }
  }

  const googleAuth = async (response) => {
    if (response.type === 'success') {
      return onSignInSuccess('google', response.authentication?.accessToken as string)
    } else {
      return onError && onError('An unknown error has occured')
    }
  }

  useEffect(() => {
    if (response && AppState.currentState === 'active') {
      googleAuth(response)
    }
  }, [response, AppState.currentState])

  const appleAuth = async () => {
    try {
      const { identityToken } = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL]
      })
      return onSignInSuccess('apple', identityToken as string)
      // signed in
    } catch (e) {
      if (e.code === 'ERR_CANCELED') {
        return onCancel()
      }
      return onError && onError('A unknown error occured')
    }
  }

  const [showInstaLogin, setShowInstaLogin] = useState(false)
  const instagramAuth = async (token: string) => {
    try {
      setShowInstaLogin(false)
      return onSignInSuccess('instagram', token)
    } catch (error) {
      return onError && onError(error.message)
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}
    >
      <TouchableOpacity onPress={facebookAuth}>
        <Image source={facebookLogo} style={{ height: 50, width: 50 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={promptAsync}>
        <Image source={googleLogo} style={{ height: 50, width: 50 }} />
      </TouchableOpacity>

      {enableInstagram && (
        <TouchableOpacity onPress={() => setShowInstaLogin(true)}>
          <Image source={instagramLogo} style={{ height: 50, width: 50 }} />
        </TouchableOpacity>
      )}

      {!isAndroid && (
        <TouchableOpacity onPress={appleAuth}>
          <Image source={appleLogo} style={{ height: 50, width: 50 }} />
        </TouchableOpacity>
      )}

      {enableInstagram &&
        instagramAppId &&
        instagramAppSecret &&
        instagramRedirectUrl &&
        onError && (
          <LoginWithInstagram
            isVisisble={showInstaLogin}
            appId={instagramAppId}
            appSecret={instagramAppSecret}
            redirectUrl={instagramRedirectUrl}
            onCancel={() => setShowInstaLogin(false)}
            onError={onError}
            onSuccess={instagramAuth}
          />
        )}
    </View>
  )
}

export default SocialAuth
