import * as AppleAuthentication from 'expo-apple-authentication'
import * as Facebook from 'expo-facebook'
import * as GoogleSignIn from 'expo-google-sign-in'
import React, { useEffect, useState } from 'react'
import { Image, Platform, TouchableOpacity, View } from 'react-native'
import LoginWithInstagram from './instagram'

const appleLogo = require('./assets/images/apple.png')
const facebookLogo = require('./assets/images/facebook.png')
const googleLogo = require('./assets/images/google.png')
const instagramLogo = require('./assets/images/instagram.png')

type Props = {
  enableApple?: boolean
  enableInstagram?: boolean
  googleClientId: string
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
 * @param enableApple boolean to enable Apple sign in
 * @param enableInstagram boolean to enable Instagram sign in
 */

const SocialAuth = ({
  enableApple,
  enableInstagram,
  googleClientId,
  facebookAppId,
  instagramAppId,
  instagramAppSecret,
  instagramRedirectUrl,
  onSignInSuccess,
  onError,
  onCancel
}: Props) => {
  const isAndroid = Platform.OS === 'android'
  useEffect(() => {
    const initGoogle = async () => {
      await GoogleSignIn.initAsync({
        clientId: googleClientId,
        scopes: ['profile', 'email']
      })
    }
    initGoogle()
  }, [])

  const facebookAuth = async () => {
    try {
      await Facebook.initializeAsync({ appId: facebookAppId })
      const { type, token } = (await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email']
      })) as { type: string; token: string | undefined }
      if (type === 'success') {
        return onSignInSuccess('facebook', token as string)
      } else {
        return onError && onError('A unknown error occured')
      }
    } catch (error) {
      return onError && onError(error.message)
    }
  }

  const googleAuth = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync()
      const { type, user } = await GoogleSignIn.signInAsync()
      if (type === 'success') {
        return onSignInSuccess('google', user?.auth?.accessToken as string)
      }
    } catch ({ message }) {
      return onError && onError(message)
    }
  }

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

      <TouchableOpacity onPress={googleAuth}>
        <Image source={googleLogo} style={{ height: 50, width: 50 }} />
      </TouchableOpacity>

      {enableInstagram && (
        <TouchableOpacity onPress={() => setShowInstaLogin(true)}>
          <Image source={instagramLogo} style={{ height: 50, width: 50 }} />
        </TouchableOpacity>
      )}

      {enableApple && !isAndroid && (
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
