module.exports = app => {

  var userName
  var currentIssue

  app.on('issues.opened', async context => {

  	issueTitle = context.payload.issue.title
  	userName = context.payload.sender.login

  	const triggerPattern = /Let's Waffle!/gi;
	const triggerRegEx = triggerPattern.test(issueTitle);

	if (triggerRegEx) {

		const newLabel = context.repo({name:":runner: Let's Waffle!", color:"f5f648"})
		context.github.issues.createLabel(newLabel)

		//TODO: handle if label already exists

	    const userIssueEdits = context.issue({title:"Getting Started", labels:["in progress", ":runner: Let's Waffle!"], assignees:[userName]})
	    context.github.issues.edit(userIssueEdits)

	    const userIssueComment = context.issue({body:":wave: Hi there @" + userName + "!  I'm Let's Waffle Bot, here to help you learn how to use Waffe's automation.  Let's get started!\n\nI'll create new issues :page_facing_up::page_facing_up::page_facing_up: on your Waffle board with instructions about what to do next.\n\nTo finish this card, Close this issue and look for the next issue in the To Do column."})
	    context.github.issues.createComment(userIssueComment)
    }
  })

  app.on('issues.closed', async context => {

  	issueTitle = context.payload.issue.title

  	const triggerPattern = /Getting Started/gi;
	const triggerRegEx = triggerPattern.test(issueTitle);

	if (triggerRegEx) {

	    const userIssueComment = context.issue({body:":+1: Great job!  When an issue is closed, Waffle Bot automatically moves it to the first done column on your Waffle board.  You can close issues in GitHub or Waffle.\n\nIt's time for your next task.  Check the To Do column for your next task card!"})
	    context.github.issues.createComment(userIssueComment)

	    const issue1 = context.issue({title: "Waffle Workflow", body: ":+1: Great job!  As you probably noticed, When an issue is closed, Waffle Bot automatically moves it to the first done column on your Waffle board.  You can close issues in GitHub or Waffle.\n\nIt's time for your next task.  For this card, you're going to learn how to move an issue into In Progress when you create a branch.  When you include an issue number in your branch name and push the branch to GitHub, Waffle Bot automatically moves the issue to In Progress and assigns you to the issue.\n\nLet's try it.  Create a new file in this repo and commit it to a new branch.  Name your branch \<issuenumber-whatever-you-want\> (ex. `123-make-waffles`.  Then push the branch to GitHub.  Check back here after you've completed those steps.", labels:["to do", ":runner: Let's Waffle!"]})
	    context.github.issues.create(issue1)
    }

  })

  app.on('issues.opened', async context => {

  	issueTitle = context.payload.issue.title
  	issueNumber = context.payload.issue.number

  	const triggerPattern = /Waffle Workflow/gi;
	const triggerRegEx = triggerPattern.test(issueTitle);

	if (triggerRegEx) {

	    const userIssueComment = context.issue({body:"Tip: name your branch `" + issueNumber + "-whatever-you-want` to move this issue into progress."})
	    context.github.issues.createComment(userIssueComment)
    }
  })

  app.on('create', async context => {

  	eventType = context.payload.ref_type
  	branchName = context.payload.ref

  	if (eventType === "branch") {
  		console.log("Branch Name: " + branchName)
  	}

  })

  app.on('issues.labeled', async context => {

  	issueTitle = context.payload.issue.title
  	issueNumber = context.payload.issue.number
  	issueLabel = context.payload.label.name
  	eventSender = context.payload.sender.login

  	currentIssue = issueNumber

  	const triggerPattern = /Waffle Workflow/gi;
	const triggerRegEx = triggerPattern.test(issueTitle);

	if (triggerRegEx) {
		if (issueLabel === "in progress") {
			if (eventSender === "wafflebot[bot]") {
			console.log("WaffleBot moved issue into progress")

			const userIssueComment = context.issue({body:":+1: Great job!  You can see WaffleBot moved the issue into In Progress and assigned you to the issue.\n\nNext you'll learn how to automatically connect your Pull Request to the Issue.  This will visually connect the Issue and Pull Request on your Waffle board.\n\nCreate a Pull Request for the changes on your branch, including the keywords \<resolves #issuenumber\> in the Pull Request description ex. `resolves #123`."})
	    	context.github.issues.createComment(userIssueComment)
			}
		}
	}

  })

  app.on('pull_request.labeled', async context => {

  	issueLabel = context.payload.label.name
  	eventSender = context.payload.sender.login

	if (issueLabel === "in progress") {
		if (eventSender === "wafflebot[bot]") {
		console.log("WaffleBot moved pull request into In Progress")

		const userPRComment = context.issue({body:":+1: Great job!  Your Pull Request is now attached to your Issue on your Waffle board.  WaffleBot also assigned the Pull Request to you since you opened it.\n\nWaffleBot will move the Pull Request and Issue to Done when the Pull Request is merged.  Go ahread and try merging your Pull Request."})
    	context.github.issues.createComment(userPRComment)

		const userIssueComment = context.issue({number:currentIssue,body:":+1: Great job!  Your Pull Request is now attached to your Issue on your Waffle board.  WaffleBot also assigned the Pull Request to you since you opened it.\n\nWaffleBot will move the Pull Request and Issue to Done when the Pull Request is merged.  Go ahread and try merging your Pull Request."})
    	context.github.issues.createComment(userIssueComment)
		}
	}

  })

  app.on('pull_request.unlabeled', async context => {

  	issueLabel = context.payload.label.name
  	eventSender = context.payload.sender.login

	if (issueLabel === "in progress") {
		if (eventSender === "wafflebot[bot]") {
		console.log("WaffleBot moved pull request into Done")

		const userPRComment = context.issue({body:":+1: Great job!  Your Pull Request is now attached to your Issue on your Waffle board.  WaffleBot also assigned the Pull Request to you since you opened it.\n\nWaffleBot will move the Pull Request and Issue to Done when the Pull Request is merged.  Go ahread and try merging your Pull Request."})
    	context.github.issues.createComment(userPRComment)

		const userIssueComment = context.issue({number:currentIssue,body:":+1: Great job!  Your Pull Request is now attached to your Issue on your Waffle board.  WaffleBot also assigned the Pull Request to you since you opened it.\n\nWaffleBot will move the Pull Request and Issue to Done when the Pull Request is merged.  Go ahread and try merging your Pull Request."})
    	context.github.issues.createComment(userIssueComment)

    	const issue1 = context.issue({title: "Automating AllTheThings!", body: "You've done a great job of learning how to automate moving and assigning a card across your Waffle board.  But there's even more automation to learn about.\n\nTo keep learning, check out the [Waffle Automation Cheatsheet](https://waffle.io/features/cheatsheet) - the complete guide to customizing your Waffle board's automation and includes a Quick Reference to all the commands.\n\nI also added a few other suggestions for things to learn in the Inbox column.", labels:["to do", ":runner: Let's Waffle!"]})
    	context.github.issues.create(issue1)

    	const issue2 = context.issue({title: "Parent / Child Relationships", body: "text text text", labels:[":runner: Let's Waffle!"]})
    	context.github.issues.create(issue2)

    	const issue3 = context.issue({title: "Dependencies", body: "text text text", labels:[":runner: Let's Waffle!"]})
    	context.github.issues.create(issue3)

    	const issue4 = context.issue({title: "Code Reviews", body: "text text text", labels:[":runner: Let's Waffle!"]})
    	context.github.issues.create(issue4)

    	const issue5 = context.issue({title: "CI Jobs, Automated Tests, and Status Checks", body: "text text text", labels:[":runner: Let's Waffle!"]})
    	context.github.issues.create(issue5)

    	const issue6 = context.issue({title: "Deployments", body: "text text text", labels:[":runner: Let's Waffle!"]})
    	context.github.issues.create(issue6)
		}
	}

  })

}