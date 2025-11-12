import { world, system} from '@minecraft/server';
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";


//Example Action Forms
system.afterEvents.scriptEventReceive.subscribe((event) => {
    //Example Action Form for general obstacle
    if (event.id == "rwm:taj.color") {
        world.getPlayers().forEach((player) => {
            let test_form = new ActionFormData();
            test_form.title("Time of Day");
            test_form.body("Change the time of day to see how the Taj Mahal changes colors.");
            test_form.button("Morning", "textures/items/clock_item");
            test_form.button("Daytime", "textures/items/clock_item");
            test_form.button("Evening", "textures/items/clock_item");
            test_form.show(player).then(r => {
                // This will stop the code when the player closes the form
                if (r.canceled) {
                };


                let response = r.selection;
                switch (response) {
                    case 0:
                        // Do something when button 1 is pressed
                        player.runCommand("time set 23500")
                        player.runCommand("/structure load rwm:taj_1_morning 148 54 280 0_degrees none")
                        player.runCommand("/structure load rwm:taj_2_morning 148 54 320 0_degrees none")
                        player.runCommand("/structure load rwm:taj_3_morning 188 54 280 0_degrees none")
                        player.runCommand("/structure load rwm:taj_4_morning 188 54 319 0_degrees none")
                        //console.warn("say Spell Attack");
                        break;

                    case 1:
                        // Do something when button 2 is pressed
                        player.runCommand("time set 3000")
                        player.runCommand("/structure load rwm:taj_1_day 148 54 280 0_degrees none")
                        player.runCommand("/structure load rwm:taj_2_day 148 54 320 0_degrees none")
                        player.runCommand("/structure load rwm:taj_3_day 188 54 280 0_degrees none")
                        player.runCommand("/structure load rwm:taj_4_day 188 54 319 0_degrees none")
                        //console.warn("say Spell Defense");
                        break;

                    case 2:
                        // Do something when button 2 is pressed
                        player.runCommand("time set 12600")
                        player.runCommand("/structure load rwm:taj_1_evening 148 54 280 0_degrees none")
                        player.runCommand("/structure load rwm:taj_2_evening 148 54 320 0_degrees none")
                        player.runCommand("/structure load rwm:taj_3_evening 188 54 280 0_degrees none")
                        player.runCommand("/structure load rwm:taj_4_evening 188 54 319 0_degrees none")
                        //console.warn("say Spell Defense");
                        break;

                    default:
                }
            }).catch(e => {
                console.error(e, e.stack);
            });
        });
    }
});