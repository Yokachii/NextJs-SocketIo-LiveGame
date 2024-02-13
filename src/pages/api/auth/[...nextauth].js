// import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"
import NextAuth from "next-auth"
import {Room,User,Study} from '@/module/association'
import { isPasswordValid } from '@/utils/hash';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [

    GoogleProvider({
      clientId: `401437728205-ir3a3khfspp96c4v369fd5givpmo0gfm.apps.googleusercontent.com`,
      clientSecret: `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`,
    }),

    // DiscordProvider({
    // //   clientId: process.env.DISCORD_CLIENT_ID,
    // //   clientSecret: process.env.DISCORD_CLIENT_SECRET
    // clientId: "978701891540226118",
    // clientSecret: "jOX0xlClIERn8VxX5z1fOWeRTNdumg9g"
    // })
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "****" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        // return user

        const user2 = await User.findOne({where:{email:credentials.email}})

        const userData = user2.dataValues

        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
        console.log(userData)
        console.log(userData.id)
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
        
        if(userData&&userData.id){
          const isPasswordMatch = await isPasswordValid(
            credentials.password,
            userData.password
          );

          console.log(isPasswordMatch)
  
          if (!isPasswordMatch) {
            return null;
          }

          console.log(user2.id)
  
          return {
            name: user2.firstname,
            id:user2.id,
            email: user2.email,
          };

        }else{
          return null;
        }
        console.log(user2)

        

        return user
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },

    async signIn({ user, account, profile, email, credentials }) {
      // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
      // console.log(account)
      // console.log(profile)
      // console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||')
      if (account.provider === "google") {
        // return profile.email_verified && profile.email.endsWith("@gmail.com")
        let users = await User.findOne({where:{email:profile.email}})
        
        if(users&&users.dataValues.id){
  
          return true
  
        }else{
  
          return `/register?mail=${profile.email}` // Do different verification for other providers that don't have `email_verified`
  
        }
      }


      return true
    },

    async session({ session, token, user }) {
      // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
      // console.log(session)
      // console.log(token)
      // console.log(user)
      // console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')

      const uerss = await User.findOne({where:{email:session.user.email}})
      if(uerss){

        session.user.id=uerss.dataValues.id
        session.user.links=uerss.dataValues.links

      }else{

        session.user.id="bizzard"

      }
      // Send properties to the client, like an access_token from a porvider.
      session.accessToken = token.accessToken
      // session.user.id = user.id
      return session
    }
  },
  jwt: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "database",
  
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  }
}

export default NextAuth(authOptions)