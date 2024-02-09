import { upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Stack
} from '@mantine/core';
import { DiscordButton } from './googleButton';

export function Login(props: PaperProps) {
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: true,
        },

        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val: string) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    return (
        <>
            <div style={{
                maxWidth: 'calc(26.25rem * var(--mantine-scale))',
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                <Paper radius="md" p="xl" withBorder {...props}>
                    <Text size="lg" fw={500}>
                        Welcome to Oxie, Login with
                    </Text>

                    <Group grow mb="md" mt="md">
                        <DiscordButton radius="xl">Discord</DiscordButton>
                    </Group>

                    <Divider label="Or continue with email (only oxie sso users)" labelPosition="center" my="lg" />

                    <form onSubmit={form.onSubmit(() => { })}>
                        <Stack>
                            <TextInput
                                required
                                label="Email"
                                placeholder="john.doe@oxie.fr"
                                value={form.values.email}
                                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                                error={form.errors.email && 'Invalid email'}
                                radius="md"
                            />

                            <PasswordInput
                                required
                                label="Password"
                                placeholder="Your password"
                                value={form.values.password}
                                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                                error={form.errors.password && 'Password should include at least 6 characters'}
                                radius="md"
                            />
                        </Stack>

                        <Group justify="center" mt="xl">
                            <Button type="submit" radius="xl">
                                {upperFirst('login')}
                            </Button>
                        </Group>
                    </form>
                </Paper>
            </div>
        </>
    );
}