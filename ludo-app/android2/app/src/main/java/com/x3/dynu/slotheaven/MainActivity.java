package com.x3.dynu.slotheaven;

import android.media.AudioManager;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set the volume control stream to media volume
        setVolumeControlStream(AudioManager.STREAM_MUSIC);
    }
}
