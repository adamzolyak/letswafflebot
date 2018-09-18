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

	    const userIssueEdits = context.issue({title:"👏 Getting Started", labels:["in progress", ":runner: Let's Waffle!"], assignees:[userName]})
	    context.github.issues.edit(userIssueEdits)

	    const userIssueComment = context.issue({body:":wave: Hi there @" + userName + "!  I'm Let's Waffle! Bot, here to help you learn how to use Waffe.io as part of your development workflow.\n\n## How It Works\n\nI'll create new issues :page_facing_up::page_facing_up::page_facing_up: on your Waffle board and also comment :mega: on issues and pull requests as you complete tasks :white_check_mark:.  Watch for real-time notifications :wave: on your Waffle board to see when I've done something new.  You can click on the real-time notificaiton to see what changed.\n\n![Image of Communicating with Bot](https://i.imgur.com/ucHYGbe.png)\n\n## What's Next?\n\nTo move to the next task, close this issue (using the Close button below) and look for a new issue in the To Do column."})
	    context.github.issues.createComment(userIssueComment)
    }
  })

  app.on('issues.closed', async context => {

  	issueTitle = context.payload.issue.title

  	const triggerPattern = /Getting Started/gi;
	const triggerRegEx = triggerPattern.test(issueTitle);

	if (triggerRegEx) {

	    let userIssueComment = context.issue({body:":+1: Great job!  When an issue is closed, Waffle Bot automatically moves it to the first done column on your Waffle board.  You can close issues in GitHub or Waffle.\n\nIt's time for your next task.  Check the To Do column for your next task card!"})
	    context.github.issues.createComment(userIssueComment)

	    let issue1 = context.issue({title: "Waffle Workflow", body: ""})
	    context.github.issues.create(issue1).then(function(s) { console.log(s.data.number + " " + s.data.html_url)
        
        let issue1Update = context.issue({number:s.data.number,body:":+1: Great job!\n\n## What just happened?\n\nAs you probably noticed, when an issue is closed, Waffle Bot automatically moves it to the Done column on your Waffle board.  This is the first of many ways WaffleBot automates project management updates for you.  Whereever an issue is closed from - GitHub, Waffle, etc - the card will automatically be moved to Done on your Waffle board.\n\n## What's Next?\n\nIt's time for your next task!  You're going to learn how to move an issue into In Progress on your Waffle board when you create a branch.\n\nWhen you include an issue number in your branch name and push the branch to GitHub, WaffleBot automatically moves the issue to In Progress and assigns you to the issue.\n\nLet's try it!\n1. Create a new file in this repo and commit it to a new branch.  Name your branch `" + s.data.number + "-whatever-you-want`.\n1. Push the branch to GitHub.\n1. Watch your Waffle board to see what happens and check back here after you've completed these steps.", labels:["to do", ":runner: Let's Waffle!"]})
        context.github.issues.edit(issue1Update)
      })
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

			const userIssueComment = context.issue({body:":+1: Great job!\n\n## What just happened?\n\nWaffleBot moved the issue into In Progress and assigned you to the issue.\n\n## What's next?\n\nNext you'll learn how to automatically connect your Pull Request to the Issue.  This will visually connect the Issue and Pull Request on your Waffle board and also automatically update the Issue based on Pull Request activity.\n\nLet's try it!\n1. Create a Pull Request for the changes on your branch.  In the Pull Request description, include `resolves #" + issueNumber + "`.\n1. Watch your Waffle board to see what happens and check back here after you've completed these steps."})
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

  		const userPRComment = context.issue({body:":+1: Great job!\n\n## What just happened?\n\nWaffleBot moved the Pull Request to the In Progress column and assigned it to you since you opened it.  Your Pull Request is also visually connected to the Issue on your Waffle board, making it easy to track code and issues together.\n\n##What's next?\n\nWaffleBot will move the Pull Request and Issue to the Done column when the Pull Request is merged.  Let's try it!\n1. Merge your Pull Request.\n1. Watch your Waffle board to see what happens and check back here after you've completed these steps."})
      	context.github.issues.createComment(userPRComment)

  		const userIssueComment = context.issue({number:currentIssue,body:":+1: Great job!\n\n## What just happened?\n\nWaffleBot moved the Pull Request to the In Progress column and assigned it to you since you opened it.  Your Pull Request is also visually connected to the Issue on your Waffle board, making it easy to track code and issues together.\n\n##What's next?\n\nWaffleBot will move the Pull Request and Issue to the Done column when the Pull Request is merged.  Let's try it!\n1. Merge your Pull Request.\n1. Watch your Waffle board to see what happens and check back here after you've completed these steps."})
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

  		const userPRComment = context.issue({body:":+1: Great job!\n\n## What just happened?\n\nWaffleBot moved the Issue and Pull Request to the Done column.\n\n##What's next?\n\nCongradulations!  You learn how to move a card from idea to done without ever manually updating your Waffle board :smile:!  This task is complete!\b\bCheck the To Do and Inbox columns on your Waffle board for other tasks to keep on learning!"})
      	context.github.issues.createComment(userPRComment)

  		const userIssueComment = context.issue({number:currentIssue,body:":+1: Great job!\n\n## What just happened?\n\nWaffleBot moved the Issue and Pull Request to the Done column.\n\n##What's next?\n\nCongradulations!  You learn how to move a card from idea to done without ever manually updating your Waffle board :smile:!  This task is complete!\b\bCheck the To Do and Inbox columns on your Waffle board for other tasks to keep on learning!"})
      	context.github.issues.createComment(userIssueComment)

      	const issue1 = context.issue({title: "Automate AllTheThings!", body: ":muscle: You've done a great job of learning how to automate :running: a card from idea to done across your Waffle board.  But there's even more automation!\n\nTo keep learning, check out the [Waffle Automation Cheatsheet](https://waffle.io/features/cheatsheet) - the complete guide to customizing your Waffle board's automation :running::running::running: and includes a Quick Reference to all the commands :star:.\n\nThere are also a few additiomal cards in the Inbox column if you'd like to keep learning about Waffle.io :grinning:.", labels:["to do", ":runner: Let's Waffle!"]})
      	context.github.issues.create(issue1)

        const issue2 = context.issue({title: "Parent / Child Relationships", body: "TODO", labels:[":runner: Let's Waffle!"]})

        const issue3 = context.issue({title: "Dependencies", body: "TODO", labels:[":runner: Let's Waffle!"]})

        const issue4 = context.issue({title: "Code Reviews", body: "TODO", labels:[":runner: Let's Waffle!"]})

        const issue5 = context.issue({title: "CI Jobs, Automated Tests, and Status Checks", body: "TODO", labels:[":runner: Let's Waffle!"]})
        
        const issue6 = context.issue({title: "Deployments", body: "TODO", labels:[":runner: Let's Waffle!"]})
   	
      	context.github.issues.create(issue6)
        .then(context.github.issues.create(issue5))
        .then(context.github.issues.create(issue4))
        .then(context.github.issues.create(issue3))
        .then(context.github.issues.create(issue2)) 
        
  		}
  	}

  })

}