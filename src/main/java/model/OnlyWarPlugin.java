package model;

import io.github.thisisnozaku.charactercreator.plugins.GamePlugin;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

/**
 * Created by Damien on 4/18/2016.
 */
@Component
@Service(value=GamePlugin.class)
public class OnlyWarPlugin extends GamePlugin<OnlyWarCharacter> {

}
