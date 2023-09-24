"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PasswordField from "../components/PasswordField";
import { AuthService } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/contexts/AuthContext";
import { OtpModal } from "../components/OptModal";
import { useState } from "react";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

export function Login() {
  const [isTwoFAModalOpen, setIsTwoFAModalOpen] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    AuthService.login(data)
      .then((data) => {
        if (data.access_token) {
          login();
          localStorage.setItem("token", data.access_token);
          navigate("/profile");
        } else {
          setIsTwoFAModalOpen(true);
        }
      })
      .catch((error) => toast.error(error));
  };

  const submitLoginVerification = (data: any) => {
    AuthService.verifyLogin(data)
      .then((data) => {
        login();
        localStorage.setItem("token", data.access_token);
        navigate("/profile");
      })
      .catch((error) => toast.error(error));
  };

  return (
    <Container maxWidth="sm">
      <Paper>
        <Box p={2}>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              ~ Login ~
            </Typography>
            <Divider />
            <TextField
              label="Email"
              variant="outlined"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <PasswordField
              label="Password"
              variant="outlined"
              {...register("password")}
            />
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Login
            </Button>
            <Typography variant="body2" align="center">
              Not a member? <Link to="/signup">Register here!</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
      <OtpModal
        open={isTwoFAModalOpen}
        title="Login verification"
        description="Use the code to verify your login"
        onSubmit={submitLoginVerification}
      />
    </Container>
  );
}
