 export interface ChatProps {
    messages : Message[],
    userId : string
 }

 interface Message {
    message: string;
    from: string;
   
  }

  export interface ProfileType  {

    profile : {
        avatarfull?: string,
        personaname?: string,
        steamid: string
    }
  }