// a list of all possible problem types
// TODO add while loops
// TODO make each type of mutator a type of for loop to allow for better customization?
const ALL_PROBLEM_TYPES = [
    "forLoop"
];

// globals
let score = 0;
let selectedProblemTypes = JSON.parse(JSON.stringify(ALL_PROBLEM_TYPES));
let problem, answer;

// initialize UI components
generateProblem();
createProblemTypeCheckboxes();

/**
 * Create the problem type checkboxes that allow users to customize what types of problems they
 * get to practice.
 */
function createProblemTypeCheckboxes() {
    // create checkboxes for the user to be able to customize problem types that they practice
    ALL_PROBLEM_TYPES.forEach(problemType => {
        // create list item element
        const li = document.createElement("li");

        // create a checkbox element
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = problemType;
        input.name = problemType;
        input.value = problemType;
        input.checked = true;

        // define click action to add/remove problem type from selected problem types
        input.onclick = () => {
            // get the value of the input element
            const val = input.value;

            // if the input is checked, add to list of selected problem types
            if (input.checked) {
                selectedProblemTypes.push(val);
            }
            // if input is unchecked, remove it from the list of selected problem types
            else {
                selectedProblemTypes.splice(selectedProblemTypes.indexOf(val), 1);
            }

            // update prompt
            promptText = generateProblem();
            setPrompt(promptText);
        }

        // create label for checkbox input
        const label = document.createElement("label");
        label.htmlFor = problemType;
        label.innerText = problemType;

        // add checkbox and label to list item
        li.appendChild(input);
        li.appendChild(label);

        // add list item to the problem types list element
        document.getElementById("problemTypes").appendChild(li);
    });
}

/**
 * Set the contents of the code prompt view to formatted code text.
 * @param {String} code 
 */
function setPrompt(code) {
    const codeEl = document.getElementById("code");

    // clear out anything that could still be in the code prompt element
    codeEl.innerHTML = "";

    // add code mirror className so syntax highlighting works
    codeEl.className = "cm-s-default";

    // run CodeMirror syntax highlighting on the code
    CodeMirror.runMode(code, { name: "javascript" }, codeEl);
}

/**
 * Select and return a random element from an array.
 * @param {Array} arr
 * @returns {Any} element
 */
function selectRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random string of text.
 * @returns {String} text
 */
function getRandomText() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

/**
 * Get a random number [min, max).
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Number}
 */
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
* Generate a code example to display to the user as a syntax problem.
* @returns {String} problemText
*/
function generateProblem() {
    const problemType = selectRandom(selectedProblemTypes);

    if (problemType == "forLoop") {
        // TODO make division work by generating start end and steps that are GCFs
        const mutator = selectRandom(["+=", "-=", "*="]);

        if (["+=", "*="].includes(mutator)) {
            // generate start from [0,4] for +=, [1-4] for *=
            let start = mutator == "+=" ? getRandomNumber(0, 5) : getRandomNumber(1, 5);

            // generate end from [start,start+9]
            let end = getRandomNumber(start, start + 10);

            // generate step from [1, 4] for +=, [2, 4] for *=
            let step = mutator == "+=" ? getRandomNumber(1, 5) : getRandomNumber(2, 5);

            // randomly select comparator for variety
            let comparator = selectRandom(["<", "<="]);

            // put together loop header
            let header = `for (let x = ${start}; x ${comparator} ${end}; x ${mutator} ${step})`;

            // generate problem text to show to user
            problem = `${header} {\n\tconsole.log(x);\n}`;

            // execute loop to get correct answer
            answer = new Function(`let a = ""; ${header} {\n\ta += x + "\\n";\n} return a;`)().trim();
        }
        else if (["-="].includes(mutator)) {
            const end = getRandomNumber(1, 5);
            const start = getRandomNumber(end, end + 10);
            const step = getRandomNumber(1, 5);

            // randomly select comparator for variety
            const comparator = selectRandom([">", ">="]);

            // put together loop header
            const header = `for (let x = ${start}; x ${comparator} ${end}; x ${mutator} ${step})`;

            // generate problem text to show to user
            problem = `${header} {\n\tconsole.log(x);\n}`;

            // execute loop to get correct answer
            answer = new Function(`let a = ""; ${header} {\n\ta += x + "\\n";\n} return a;`)().trim();
        }
    }

    // show problem text to user
    setPrompt(problem);
}

/**
 * Change the score UI element.
 * @param {Number} delta 
 */
function setScore(delta) {
    // change score by delta value
    score += delta;

    // update score UI element
    document.getElementById("score").innerText = "Score: " + score;
}

/**
 * Check the answer that the user gives.
 */
function checkAnswer() {
    // show the notification alert
    const notif = document.getElementById("notification");
    notif.style.display = "";

    // get the user's answer
    const val = document.getElementById("answer").value.trim();

    // if the user's answer is correct
    if (val == answer) {
        // give the user feedback that they're right
        notif.innerHTML = "That's right!";
        notif.className = "success";

        // add points to the user's score
        setScore(10);

        // clear the user's answer
        document.getElementById("answer").value = "";

        // generate a new problem
        generateProblem();
    }
    else {
        // give the user feedback that they're right
        notif.innerHTML = "That's incorrect.";
        notif.className = "failure";

        // take away points from the user's score
        setScore(-5);
    }

    // hide the notification alert after 1 second
    setTimeout(() => notif.style.display = "none", 1000);
}

// bind onclick functions to the buttons
document.getElementById("submit").onclick = checkAnswer;