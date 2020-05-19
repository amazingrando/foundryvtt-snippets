/*  For use with FoundryVTT
- World: Simple World-Building
- Game System: Fate
- Author: Amazing Rando
- Type: Macro

Use this macro to quickly make skill rolls.
Each PC (actor) should have matching Attributes
that can be pulled from their sheets.

Example: Ash adds the skill "warding" as a Number
and gives it a value of 4. When Ash runs this macro
it will roll their Warding skill and add +4 to the result.
*/

/*  Define skill lists. If you only have one section,
    just use "Common" */
const skillList = {
  Common: [
    "athletics",
    "burglary",
    "deceive",
    "empathy",
    "fight",
    "investigate",
    "lore",
    "notice",
    "physique",
    "provoke",
    "rapport",
    "stealth",
    "territory",
    "will",
  ],
  Magic: ["warding", "naming", "shaping", "seeking"],
};

function createListOfSkills() {
  let output = "";
  for (var skillType in skillList) {
    if (output !== "") {
      output += "</optgroup>";
    }
    if (skillList.hasOwnProperty(skillType)) {
      output += `<optgroup label="${skillType} Skills">`;
      skillList[skillType].map((x) => {
        output += `<option value="${x}">${x}</option>`;
      });
    }
  }
  output += "</optgroup>";
  return output;
}

let applyChanges = false;
if (!actor) {
  new Dialog({
    title: `Select a Token to use this macro.`,
    content: `<h2>Select a Token to use this macro.</h2>`,
    buttons: {
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Close`,
      },
    },
    default: "no",
    close: (html) => {},
  }).render(true);
} else {
  new Dialog({
    title: `Skill Roll`,
    content: `
        <form>
          <div class="form-group">
            <label>Choose a Skill:</label>
            <select id="skill" name="skill">
            ${createListOfSkills()}
            </select>
          </div>
        </form>
        `,
    buttons: {
      yes: {
        icon: "<i class='fas fa-check'></i>",
        label: `Roll Skill`,
        callback: () => (applyChanges = true),
      },
      no: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel`,
      },
    },
    default: "yes",
    close: (html) => {
      if (!actor) {
        applyChanges = false;
      }
      if (applyChanges) {
        let skillToRoll = html.find('[name="skill"]')[0].value;
        let skillMod;

        if (typeof actor.data.data.attributes[skillToRoll] != "undefined") {
          skillMod = actor.data.data.attributes[skillToRoll].value;
        } else {
          skillMod = 0;
        }

        let r = new Roll(
          `${String(skillToRoll).toUpperCase()} ― 4df + @skill`,
          {
            skill: skillMod,
          }
        );

        r.roll();
        r.toMessage();
      }
    },
  }).render(true);
}
