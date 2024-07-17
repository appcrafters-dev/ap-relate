"use client";

import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

export default function TfmNotificationCenter({ user }) {
  return (
    <>
      <NovuProvider
        subscriberId={user.profile?.id || user.id}
        applicationIdentifier="GSnxkPoaNm6z" // update
        styles={{
          bellButton: {
            root: {
              svg: {
                color: "#d1d5db",
                minWidth: "1rem",
                minHeight: "1rem",
              },
            },
          },
          popover: {
            dropdown: {
              borderRadius: "2px",
            },
          },
        }}
      >
        <PopoverNotificationCenter colorScheme="light" footer={() => <span />}>
          {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
        </PopoverNotificationCenter>
      </NovuProvider>
    </>
  );
}
