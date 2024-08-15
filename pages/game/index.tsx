"use client";
import { useEffect } from "react";
import * as fcl from '@onflow/fcl'
import { Unity, useUnityContext } from "react-unity-webgl";
import useCurrentUser from "../../hooks/useCurrentUser";

const GameView = () => {
  const {
    unityProvider,
    sendMessage,
    loadingProgression,
    isLoaded,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "Build/public.loader.js",
    dataUrl: "Build/public.data",
    frameworkUrl: "Build/public.framework.js",
    codeUrl: "Build/public.wasm",
    streamingAssetsUrl: "StreamingAssets",
  });

  const user = useCurrentUser()

  const handleConnectWallet = () => {
    document.getElementById("ConnectButton").click();
  };
  const handleDisconnectWallet = () =>{
    fcl.unauthenticate();
  }

  const ChangeAddressText = (address: string) => {
    sendMessage("FlowManager", "ChangeAddressText", address);
  } 

  useEffect(()=>{
    if(isLoaded && user.loggedIn)
    {
        ChangeAddressText(user.addr);
    }
    if(!user.loggedIn && isLoaded)
    {
        ChangeAddressText("");
    }
    if(!isLoaded)
    {
      handleDisconnectWallet();
    }
  }, [isLoaded, user.loggedIn]);


  useEffect(() => {
    addEventListener("ConnectWallet", handleConnectWallet);
    addEventListener("DisconnectWallet", handleDisconnectWallet);
    return () => {
      removeEventListener("ConnectWallet", handleConnectWallet);
      removeEventListener("DisconnectWallet", handleDisconnectWallet);
    };
  }, [addEventListener, removeEventListener, handleConnectWallet]);

  return (
    <div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "2"}}>
      {!isLoaded && (
        <p style={{display: "flex", position: "absolute"}}>
          Loading Application... {Math.round(loadingProgression * 100)}%
        </p>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ aspectRatio: 0.4613733906, height: "inherit" }}
      />
    </div>
  );
};

export default GameView;
