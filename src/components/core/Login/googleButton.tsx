import { Button, ButtonProps } from "@mantine/core";
import { NpmIcon } from "@mantinex/dev-icons";
import { useSession, signIn, signOut } from "next-auth/react"

export default function GoogleButton(props: ButtonProps & React.ComponentPropsWithoutRef<"button">) {

  // const {data:session} = useSession()
  // console.log(session)

  return (
    <Button
      leftSection={<NpmIcon style={{ width: "1.5rem" }} color="#5865F2" />}
      variant="default"
      onClick={()=>{signIn()}}
      {...props}
    />
  );
}
