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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { MuiTelInput } from "mui-tel-input";
import { toast } from "react-toastify";
import PasswordField from "../components/PasswordField";
import { AuthService } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const SignUpFormSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  })
  .refine((data) => /[A-Z]/.test(data.password), {
    message: "Password must contain at least one uppercase letter",
    path: ["password"],
  })
  .refine((data) => /[a-z]/.test(data.password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((data) => /\d/.test(data.password), {
    message: "Password must contain at least one digit",
    path: ["password"],
  })
  .refine((data) => /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]+/.test(data.password), {
    message: "Password must contain at least one special character",
    path: ["password"],
  });

type SignUpFormData = z.infer<typeof SignUpFormSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const captchaRef = useRef<ReCAPTCHA | null>(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
  });
  console.log("errors", errors);
  const verifyCaptcha = async (token: string) => {
    const res = await AuthService.verifyCaptcha({ token });
    return res;
  };

  const registerUser = (userData: SignUpFormData) => {
    AuthService.signup(userData)
      .then(() => {
        toast.success("You have successfully registered!");
        navigate("/login");
      })
      .catch((error) => toast.error(error));
  };

  const onSubmit = async (userData: SignUpFormData) => {
    let token = captchaRef.current?.getValue();
    if (token) {
      const data = await verifyCaptcha(token);
      if (data.success) {
        registerUser(userData);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper>
        <Box p={2}>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              ~ Registration ~
            </Typography>
            <Divider />
            <Stack spacing={2} direction="row">
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register("firstName")}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                {...register("lastName")}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
              />
            </Stack>
            <TextField
              label="Email"
              variant="outlined"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <Controller
              name="phone"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <MuiTelInput
                  label="Phone number"
                  value={value}
                  onChange={onChange}
                  defaultCountry="UA"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <PasswordField
              label="Password"
              variant="outlined"
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <PasswordField
              label="Confirm password"
              variant="outlined"
              {...register("confirm")}
              error={Boolean(errors.confirm)}
              helperText={errors.confirm?.message}
            />
            <ReCAPTCHA
              sitekey="6LcDkkYoAAAAACDnO2mlgJEAzDS2iqreS76rRrje"
              ref={captchaRef}
            />
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Register
            </Button>
            <Typography variant="body2" align="center">
              Already a member? <Link to="/login">Log In</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
