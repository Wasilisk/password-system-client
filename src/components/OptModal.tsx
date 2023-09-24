import {
  Box,
  Button,
  Dialog,
  DialogContentText,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const TokenSchema = z.object({
  token: z.string().refine((value) => value.length === 6, {
    message: "Token must be exactly 6 characters long",
  }),
});

interface OtpModalProps {
  open: boolean;
  title: string;
  description: string;
  onSubmit: (data: { token: string }) => void;
}

export const OtpModal = ({
  open,
  title,
  description,
  onSubmit,
}: OtpModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ token: string }>({
    resolver: zodResolver(TokenSchema),
  });

  return (
    <Dialog open={open}>
      <Box p={2}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box px={2}>
        <DialogContentText mb={2}>{description}</DialogContentText>
        <TextField
          label="Token"
          fullWidth
          {...register("token")}
          autoFocus
          error={Boolean(errors.token)}
          helperText={errors.token?.message}
        />
      </Box>
      <Box p={2} display="flex" justifyContent="flex-end">
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};
