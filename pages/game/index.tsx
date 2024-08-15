"use client";
import { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styles from "../../styles/Home.module.css";
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
        ChangeAddressText("Connect Wallet");
    }
  }, [isLoaded, user.loggedIn]);


  useEffect(() => {
    addEventListener("ConnectWallet", handleConnectWallet);
    return () => {
      removeEventListener("ConnectWallet", handleConnectWallet);
    };
  }, [addEventListener, removeEventListener, handleConnectWallet]);

  return (
    <div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
      {!isLoaded && (
        <p className="absolute z-[-1]">
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
