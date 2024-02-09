import { upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import GoogleButton from "@/components/core/Login/googleButton";
import { useSession, signIn, signOut } from "next-auth/react"

const login = (props: PaperProps) => {
  
  const { data: session } = useSession()
  console.log(session)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm({
    initialValues: {
      email: "",
      // name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val: string) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });

  const handleLogin = async (email:string,password:string) => {
    
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    console.log('loged with' + email + password)

  }

  return (
    <>
      <div
        style={{
          maxWidth: "calc(26.25rem * var(--mantine-scale))",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >

        {session?.user?(
          <p>non</p>
        ):(
          <Paper radius="md" p="xl" withBorder {...props}>
          <Text size="lg" fw={500}>
            Welcome to Oxie, Login with
          </Text>

          <Group grow my="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group>

          <Divider label="Or continue with email (only Oxie SSO users)" labelPosition="center" my="lg" />

          <form onSubmit={form.onSubmit((e) => {handleLogin(e.email,e.password)})}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="john.doe@oxie.fr"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password && "Password should include at least 6 characters"}
                radius="md"
              />
            </Stack>

            <Group justify="center" mt="xl">
              <Button type="submit" radius="xl">
                {upperFirst("login")}
              </Button>
            </Group>
          </form>
        </Paper>
        )}
        
      </div>
    </>
  );
};

export default login;