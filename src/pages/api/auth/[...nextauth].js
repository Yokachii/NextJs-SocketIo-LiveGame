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
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "****" }
      },
      async authorize(credentials, req) {
        const user2 = await User.findOne({where:{email:credentials.email}})
        const userData = user2.dataValues

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
      console.log(account.provider)
      if (account.provider === "google") {
        let users = await User.findOne({where:{email:profile.email}})

        
        if(users&&users.dataValues.id){
  
          return true
  
        }else{
  
          return `/register?mail=${profile.email}` // Do different verification for other providers that don't have `email_verified`
  
        }
      }else if(account.provider === "credentials"){
        return true
        // return `/chess/friend`
      }


      return true
    },

    async session({ session, token, user }) {
      const uerss = await User.findOne({where:{email:session.user.email}})
      if(uerss){

        session.user.id=uerss.dataValues.id
        session.user.links=uerss.dataValues.links

      }else{
        session.user.id=""
      }
      session.accessToken = token.accessToken
      return session
    }
  },
  jwt: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    secret:`qifJLBsjiCG5XS7pfgQ8UaurDKHGmiFKLmd6HD6xfLU=`,
  }
}

export default NextAuth(authOptions)