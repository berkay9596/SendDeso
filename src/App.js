import React, { useState, useEffect, createRef } from "react";
import { Box, Grid, Stack, Button, TextField } from "@mui/material";
import DesoIdentity from "./libs/desoIdentity";

import DesoApi from "./libs/desoApi";

import Notification from "./Notification";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [toUsername, setToUsername] = useState("");
  const [message, setMessage] = useState(
    "👉 waiting for you to send your GM..."
  );
  const [publicKey, setSetPublicKey] = useState(null);
  const [desoIdentity, setDesoIdentity] = useState(null);
  const [desoApi, setDesoApi] = useState(null);
  const [posts, setPosts] = useState([]);

  const IdentityUsersKey = "identityUsersV2";
  useEffect(() => {
    const di = new DesoIdentity();
    setDesoIdentity(di);
    const da = new DesoApi();
    setDesoApi(da);

    let user = {};
    if (localStorage.getItem(IdentityUsersKey) === "undefined") {
      user = {};
    } else if (localStorage.getItem(IdentityUsersKey)) {
      user = JSON.parse(localStorage.getItem(IdentityUsersKey) || "{}");
    }

    if (user.publicKey) {
      setLoggedIn(true);
      setSetPublicKey(user.publicKey);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async () => {
    const user = await desoIdentity.loginAsync(4);
    setSetPublicKey(user.publicKey);
    setLoggedIn(true);
  };
  const logout = async () => {
    await desoIdentity.logout(publicKey);
    setSetPublicKey(null);
    setLoggedIn(false);
  };

  const sendGm = async () => {
    //alert("I will eventually create your post")
    const body = "Deneme " + toUsername;
    const extraData = {
      app: "Deneme",
      type: "Deneme",
    };
    const rtnSubmitPost = await desoApi?.submitPost(publicKey, body, extraData);
    const transactionHex = rtnSubmitPost?.TransactionHex;
    const signedTransactionHex = await desoIdentity?.signTxAsync(
      transactionHex
    );
    const rtnSubmitTransaction = await desoApi?.submitTransaction(
      signedTransactionHex
    );

    if (rtnSubmitTransaction) {
      setMessage("🎉 GM Sent!!! 🥳");
    }
  };

  const likePost = async () => {
    for (let i = 0; i < posts.length; i++) {
      const likedPostHashHex = posts[i];
      const isUnlike = false;
      const minFeeRateNanosPerKB = 1000;
      const createLike = await desoApi?.createLike(
        isUnlike,
        likedPostHashHex,
        minFeeRateNanosPerKB,
        publicKey
      );
      const transactionHex = createLike?.TransactionHex;
      const signedTransactionHex = await desoIdentity?.signTxAsync(
        transactionHex
      );
      const rtnLike = await desoApi.submitTransaction(signedTransactionHex);

      if (rtnLike) {
        console.log("Post beğenildi");
      }
    }
  };

  const nft = async (postHashHex) => {
    const createNft = await desoApi?.makeThePostNft(postHashHex, publicKey);
    const transactionHex3 = await createNft?.TransactionHex;
    const signedTransactionHex3 = await desoIdentity?.signTxAsync(
      transactionHex3
    );
    const rtnSubmitTransaction2 = await desoApi?.submitTransaction(
      signedTransactionHex3
    );
    if (rtnSubmitTransaction2) {
      const transferNft = await desoApi?.transferNft(publicKey, postHashHex);
      const transactionHex = await transferNft?.TransactionHex;
      const signedTransactionHex4 = await desoIdentity?.signTxAsync(
        transactionHex
      );
      const rtnSubmitTransaction4 = await desoApi?.submitTransaction(
        signedTransactionHex4
      );
      if (rtnSubmitTransaction4) {
        alert("Done");
      }
    }
  };
const sendMoney =async()=>{
  const createSend = await desoApi?.sendBitclout(publicKey);
  const transactionHex = createSend?.TransactionHex;
  const signedTransactionHex = await desoIdentity?.signTxAsync(
    transactionHex
  );
  const rtnSend = await desoApi?.submitTransaction(signedTransactionHex);
  if (rtnSend) {
    alert("Money succesfully sent to BillyThai")
  }
}
  const mintNft = async () => {
    const createSend = await desoApi?.sendBitclout(publicKey);
    const transactionHex = createSend?.TransactionHex;
    const signedTransactionHex = await desoIdentity?.signTxAsync(
      transactionHex
    );
    const rtnSend = await desoApi?.submitTransaction(signedTransactionHex);
    if (rtnSend) {
      const body = "Deneme3 ";
      const extraData = {
        app: "Deneme3",
        type: "Deneme3",
      };
      const rtnSubmitPost = await desoApi?.submitPost(
        publicKey,
        body,
        extraData
      );
      const transactionHex2 = await rtnSubmitPost?.TransactionHex;
      const signedTransactionHex2 = await desoIdentity?.signTxAsync(
        transactionHex2
      );
      const rtnSubmitTransaction = await desoApi?.submitTransaction(
        signedTransactionHex2
      );
      if (rtnSubmitTransaction) {
        const TxnHashHex = rtnSubmitTransaction?.TxnHashHex;
        setTimeout(() => {
          nft(TxnHashHex);
        }, 2000);
      }
    }
  };
  const getPosts = async () => {
    const createPosts = await desoApi?.getPosts();
    console.log("createPosts", createPosts);
    setPosts(createPosts);
    const transactionHex = createPosts?.TransactionHex;

    const signedTransactionHex = await desoIdentity?.signTxAsync(
      transactionHex
    );
    const rtnSend = await desoApi?.submitTransaction(signedTransactionHex);

    if (rtnSend) {
      console.log("başarılı");
    }
  };

  return (
    <>
      <iframe
        title="desoidentity"
        id="identity"
        frameBorder="0"
        src="https://identity.deso.org/embed?v=2"
        style={{
          height: "100vh",
          width: "100vw",
          display: "none",
          position: "fixed",
          zIndex: 1000,
          left: 0,
          top: 0,
        }}
      ></iframe>
      <Grid container>
        <Grid item sm={0} lg={4}></Grid>
        <Grid
          item
          sm={12}
          lg={4}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Stack>
            <Box sx={{ mb: 2, mt: 2 }}>
              {loggedIn ? (
                <Button variant="contained" onClick={logout}>
                  Log Out
                </Button>
              ) : (
                <Button variant="contained" onClick={login}>
                  Login
                </Button>
              )}
            </Box>
            {loggedIn ? (
              <>
                <Box sx={{ mb: 2 }}>
                  Logged publicKey is: {publicKey}
                </Box>
                {/* <Box sx={{ mb: 2 }}>
                  <TextField
                    sx={{ width: "100%", mb: 2 }}
                    id="event-username"
                    label="Send GM to..."
                    value={toUsername}
                    onChange={(e) => setToUsername(e.target.value)}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button variant="contained" onClick={sendGm}>
                    {" "}
                    Send GM{" "}
                  </Button>
                </Box> */}
                {/* <Button sx={{ mb: 2 }} variant="contained" onClick={likePost}>
                  Like the post
                </Button>
                <Button sx={{ mb: 2 }} variant="contained" onClick={mintNft}>
                  Mint NFT
                </Button>
                <Button sx={{ mb: 2 }} variant="contained" onClick={getPosts}>
                  getPosts
                </Button>
                <Notification /> */}
                <Button sx={{ mb: 2 }} variant="contained" onClick={sendMoney}>
                  Send money to BillyThai
                </Button>
                {/* <Box sx={{ mb: 2 }}>{message}</Box> */}
              </>
            ) : null}
          </Stack>
        </Grid>
        <Grid item sm={0} lg={4}></Grid>
      </Grid>
    </>
  );
}

export default App;
