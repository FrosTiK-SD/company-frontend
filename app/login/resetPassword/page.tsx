"use client";
import dynamic from "next/dynamic";
// Components
import {
    TextInput,
    Group,
    Box,
    Button,
    Typography,
    showNotification
} from "../../../components/components";

// Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";


import { handleSendPasswordResetEmail } from "../../../firebase/auth";

// export const runtime = "edge";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useDispatch();


    const handlePasswordReset = async () => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            const response = await handleSendPasswordResetEmail(email)
            console.log(response);
            if (!response.error) {
                showNotification({
                    title: "Password Reset Email Sent.",
                    message: "Check your inbox.",
                });
                router.replace("/login/recruiter");
            } else {
                let message = "Error";
                if (response.error == "Firebase: Error (auth/invalid-email).") {
                    message = "Invalid Email";
                } else if (response.error == "Firebase: Error (auth/user-not-found).") {
                    message = "User not found"
                }
                showNotification({
                    title: "Error",
                    message: message,
                })
            }
        }
    };

    return (
        <Box
            sx={{ maxWidth: 300 }}
            mx="auto"
            className="flex flex-col justify-center mt-10"
        >
            <Typography order={1} className="mb-1">Password Reset</Typography>
            <form className="mt-2">
                <TextInput
                    withAsterisk
                    label="Email"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.currentTarget.value);
                        setError(false);
                    }}
                    error={
                        error
                            ? "invalid email"
                            : null
                    }
                />
                <Group position="right" mt="md">
                    <div style={{ width: "100%" }}>
                        <Button
                            className="w-full bg-[#9c36b5]"
                            onClick={() => {
                                setError(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
                                handlePasswordReset();
                            }}
                        >
                            Send Password Reset Link
                        </Button>
                    </div>
                </Group>
            </form>
        </Box>
    );
}
