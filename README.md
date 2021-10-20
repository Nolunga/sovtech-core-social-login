
# DEPRECATED

 ## updated package can be found here https://www.npmjs.com/package/expo-social-login 
 ## updated repo can here https://github.com/Nolunga/expo-social-login   


# SOVTECH-CORE-SOCIAL-LOGIN


an awesome social login component for expo with Google, Facebook, Apple and Instagram

![screenshot](image.png)

## Features

- login with Facebook
- login with Google
- login with Instagram
- login with Apple

## How to use this cute package

### Install the cutest package

using yarn

```
yarn add expo-social-login
```

using npm

```
npm install expo-social-login
```

### Use it in your login/register screen

```
import SocialLogin from 'expo-social-login'
...
   <SocialLogin
        enableInstagram
        enableApple
        instagramAppId=""
        instagramAppSecret=""
        instagramRedirectUrl=""
        googleClientId={process.env.GOOGLE_CLIENT_ID }
        facebookAppId={process.env.FACEBOOK_APP_ID }
        onSignInSuccess={(provider, token) => handleLogin(provider,token)}
        onError={(error) =>  handleError(error)}
    />

```

## Tada! and you're good to go

![social media](https://media.giphy.com/media/3QwogXfR2vfZS/giphy.gif)
