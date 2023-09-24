import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AccountService } from "../services/accountService";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { OtpModal } from "../components/OptModal";

export function Profile() {
  const {
    isLoading,
    data: user,
    refetch,
  } = useQuery({
    queryKey: "user-profile",
    queryFn: () => AccountService.getUserInfo().then((res) => res.user),
  });
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isTwoFAModalOpen, setIsTwoFAModalOpen] = useState(false);

  const verifyPhoneNumber = () => {
    AccountService.verifyPhoneNumber()
      .then(() => {
        toast.success("A one-time code has been sent to your phone number");
        setIsPhoneModalOpen(true);
      })
      .catch((error) => toast.error(error));
  };

  const submitPhoneVerification = (data: any) => {
    AccountService.validatePhoneVerification(data)
      .then(() => {
        setIsPhoneModalOpen(false);
        refetch();
        toast.success("Your phone number has been successfully verified");
      })
      .catch((error) => toast.error(error));
  };

  const submitTwoFADeactivation = (data: any) => {
    AccountService.validateTwoFADeactivation(data)
      .then(() => {
        setIsTwoFAModalOpen(false);
        refetch();
        toast.success(
          "Two-factor authentication has been successfully deactivated"
        );
      })
      .catch((error) => toast.error(error));
  };

  const enableTwoFa = () => {
    AccountService.setTwoFA({ set_2fa: true })
      .then(() => {
        refetch();
        toast.success(
          "Two-factor authentication has been successfully activated"
        );
      })
      .catch((error) => toast.error(error));
  };

  const disableTwoFa = () => {
    AccountService.setTwoFA({ set_2fa: false })
      .then(() => {
        toast.success("A one-time code has been sent to your phone number");
        setIsTwoFAModalOpen(true);
      })
      .catch((error) => toast.error(error));
  };

  if (isLoading) {
    return (
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Container>
      <Paper>
        <Stack p={2} spacing={1}>
          <Avatar>{`${user?.firstName[0]}${user?.lastName[0]}`}</Avatar>
          <Stack direction="row" spacing={1}>
            <Typography>{user?.firstName}</Typography>
            <Typography>{user?.lastName}</Typography>
          </Stack>
          <Typography>Email: {user?.email}</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Phone: {user?.phone}</Typography>
            {user?.isPhoneVerified ? (
              <Typography>(verified)</Typography>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={verifyPhoneNumber}
              >
                Verify
              </Button>
            )}
          </Stack>
          <Divider />
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>
              Two-Factor Authentication: {user?.twoFA.toString()}
            </Typography>
            {user?.twoFA ? (
              <Button variant="outlined" size="small" onClick={disableTwoFa}>
                Disable
              </Button>
            ) : (
              <Button variant="outlined" size="small" onClick={enableTwoFa}>
                Enable
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
      <OtpModal
        open={isPhoneModalOpen}
        title="Phone number verification"
        description="Use code to verify the phone number registered on your account"
        onSubmit={submitPhoneVerification}
      />
      <OtpModal
        open={isTwoFAModalOpen}
        title="Deactivation of two-factor authentication"
        description="Use the code to activate two-factor authentication"
        onSubmit={submitTwoFADeactivation}
      />
    </Container>
  );
}
