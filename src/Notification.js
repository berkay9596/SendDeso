import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Box, TextField } from "@mui/material";
import DesoApi from "./libs/desoApi";
import axios from "axios";
const Notification = () => {
  const [username, setUsername] = useState("");
  const [desoApi, setDesoApi] = useState(null);

  const [follower, setFollower] = useState([]);
  const [liker, setLiker] = useState([]);
  const [diamonder, setDiamonder] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usernames, setUsernames] = useState([]);
  const [usernamesFollowers, setUsernamesFollowers] = useState([]);
  const [usernamesDiamonders, setUsernamesDiamonders] = useState([]);

  const [pictures, setPictures] = useState([]);

  const [pictures2, setPictures2] = useState([]);

  const [pictures3, setPictures3] = useState([]);
  const getNotifications = async () => {
    const PublicKeyBase58Check = username;
    const notificationsCall = await desoApi.getNotifications(
      PublicKeyBase58Check
    );
    await setLiker(
      notificationsCall?.Notifications.map((x) =>
        x.Metadata.TxnType === "LIKE"
          ? [
              x.Metadata.TransactorPublicKeyBase58Check,
              x.Metadata.LikeTxindexMetadata.PostHashHex,
            ]
          : "x"
      ).filter((item, pos) => item.indexOf("x"))
    );
    await setFollower(
      notificationsCall?.Notifications.map((x) =>
        x.Metadata.TxnType === "FOLLOW"
          ? [x.Metadata.TransactorPublicKeyBase58Check]
          : "x"
      ).filter((item, pos) => item.indexOf("x"))
    );
    await setDiamonder(
      notificationsCall?.Notifications.map((x) =>
        x.Metadata.TxnType === "BASIC_TRANSFER"
          ? [
              x.Metadata.TransactorPublicKeyBase58Check,
              x.Metadata.BasicTransferTxindexMetadata.DiamondLevel,
              x.Metadata.BasicTransferTxindexMetadata.PostHashHex,
            ]
          : "x"
      ).filter((item, pos) => item.indexOf("x"))
    );
  };

  const getProfilePictures = async (body) => {
    return await axios
      .post(
        "https://deso-get-profile-pictures.herokuapp.com/api/get-users-username-and-profile-picture",
        body
      )
      .then((res) => setPictures(res.data));
  };
  const getProfilePictures2 = async (body) => {
    return await axios
      .post(
        "https://deso-get-profile-pictures.herokuapp.com/api/get-users-username-and-profile-picture",
        body
      )
      .then((res) => setPictures2(res.data));
  };
  const getProfilePictures3 = async (body) => {
    return await axios
      .post(
        "https://deso-get-profile-pictures.herokuapp.com/api/get-users-username-and-profile-picture",
        body
      )
      .then((res) => setPictures3(res.data));
  };
  useEffect(() => {
    if (liker.length > 0 && diamonder.length > 0 && follower.length > 0) {
      getUsers();
      const allPublicKeysLiker = {
        ListPublicKey: liker.map((x) => x[0]),
      };
      getProfilePictures(allPublicKeysLiker);
      const allPublicKeysFollower = {
        ListPublicKey: follower.map((x) => x[0]),
      };
      getProfilePictures2(allPublicKeysFollower);

      const allPublicKeysDiamonder = {
        ListPublicKey: diamonder.map((x) => x[0]),
      };
      getProfilePictures3(allPublicKeysDiamonder);
    }
  }, [liker, diamonder, follower]);

  useEffect(() => {
    const da = new DesoApi();
    setDesoApi(da);
  }, []);

const filterNotifications =async()=>{
  const PublicKeyBase58Check = username;
  const notificationsCall = await desoApi.getNotifications(
    PublicKeyBase58Check
  );
  console.log("notificationsCall",notificationsCall)

  //SUBMIT_POST "FOLLOW" DAO_COIN_TRANSFER "LIKE" NFT_TRANSFER "BASIC_TRANSFER" COIN_TRANSFER 
}


  const getUsers = async () => {
    const likers = await liker?.map((x) => x[0]);
    const followers = await follower?.map((x) => x[0]);
    const diamonders = await diamonder?.map((x) => x[0]);
    const users = await desoApi.getUsersStateless(likers);
    const followerUsers = await desoApi.getUsersStateless(followers);
    const diamonderUsers = await desoApi.getUsersStateless(diamonders);
    await setUsernames(
      users?.UserList.map((user) => user?.ProfileEntryResponse?.Username)
    );
    await setUsernamesFollowers(
      followerUsers?.UserList.map(
        (user) => user?.ProfileEntryResponse?.Username
      )
    );
    await setUsernamesDiamonders(
      diamonderUsers?.UserList.map(
        (user) => user?.ProfileEntryResponse?.Username
      )
    );
    setLoading(false);
  };

  useEffect(()=>{})
  return (
    <div>
      <Box sx={{ mb: 2 }}>
        <TextField
          sx={{ width: "100%", mb: 2 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Get notifications of any profile using his/her public key"
        />
      </Box>
      <Box />
      <Button sx={{ mb: 2 }} variant="contained" onClick={getNotifications}>
        Get notifications
      </Button>

      <>
        <div>
          {loading ? (
            "loading"
          ) : (
            <>
              {usernames.length > 0
                ? liker?.map((like, index) => (
                    <ul>
                      <li
                        style={{
                          borderTop: "1px solid #b0b0b0",
                          padding: "0.3rem",
                        }}
                      >
                       
                          <span
                            style={{
                              position: "relative",
                              bottom: "10px",
                              right: "5px",
                            }}
                          >
                            ❤️
                          </span>
                          <img
                            src={pictures.map((x) => x.ProfilePicture)[index]}
                            style={{
                              height: "38px",
                              width: "38px",
                              borderRadius: "50%",
                            }}
                          />{" "}
                          {usernames[index]} Liked your post <a
                          href={`https://diamondapp.com/posts/${like[1]}`}
                          style={{ cursor: "pointer" }}
                          target="blank"
                        >
                          See more...
                        </a>
                      </li>
                    </ul>
                  ))
                : ""}
              {usernamesFollowers.length > 0
                ? follower?.map((follow, index) => (
                    <ul>
                      <li
                        style={{
                          borderTop: "1px solid #b0b0b0",
                          padding: "0.3rem",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            bottom: "10px",
                            right: "5px",
                          }}
                        >
                          ❤️
                        </span>
                        <img
                          src={pictures2.map((x) => x.ProfilePicture)[index]}
                          style={{
                            height: "38px",
                            width: "38px",
                            borderRadius: "50%",
                          }}
                        />
                        {usernamesFollowers[index]} Followed you.
                      </li>
                    </ul>
                  ))
                : ""}
              {usernamesDiamonders.length > 0
                ? diamonder.map((trans, index) => (
                    <ul>
                      <li
                        style={{
                          borderTop: "1px solid #b0b0b0",
                          padding: "0.3rem",
                        }}
                      >
                        <span
                          style={{
                            position: "relative",
                            bottom: "10px",
                            right: "5px",
                          }}
                        >
                          ❤️
                        </span>
                        <img
                          src={pictures3.map((x) => x.ProfilePicture)[index]}
                          style={{
                            height: "38px",
                            width: "38px",
                            borderRadius: "50%",
                          }}
                        />{" "}
                        {usernamesDiamonders[index]} Gave you {trans[1]} Diamond
                      </li>
                    </ul>
                  ))
                : ""}
            </>
          )}
        </div>
      </>
    </div>
  );
};

export default Notification;
