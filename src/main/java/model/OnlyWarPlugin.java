package model;

import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.internal.filter.ValueNode;
import io.github.thisisnozaku.charactercreator.plugins.GamePlugin;
import io.github.thisisnozaku.charactercreator.plugins.PluginDescription;
import io.github.thisisnozaku.charactercreator.plugins.PluginEventListener;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

import java.util.List;
import java.util.Optional;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.swing.*;

/**
 * Created by Damien on 4/18/2016.
 */
@Component
@Service(value = {GamePlugin.class})
public class OnlyWarPlugin extends GamePlugin<OnlyWarCharacter> {

}
