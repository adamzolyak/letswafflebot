module.exports = app => {

  app.on('issues.opened', async context => {

  	app.log("ISSUE TITLE: ")
  	app.log(context.payload.issue.title)

  	issueTitle = context.payload.issue.title
  	issueAuthor = context.payload.sender.login

  	var triggerPattern = /Let's Waffle!/gi;
	var triggerRegEx = triggerPattern.test(issueTitle);

	if (triggerRegEx) {

		const newLabel = context.repo({name:":runner: Let's Waffle!", color:"f5f648"})
		context.github.issues.createLabel(newLabel)

		//TODO: handle if label already exists

	    const userIssueEdits = context.issue({title:"Let's Waffle! - Getting Started", labels:["in progress", ":runner: Let's Waffle!"], assignees:[issueAuthor]})
	    context.github.issues.edit(userIssueEdits)

	    const userIssueComment = context.issue({body:":wave: Hi there @" + issueAuthor + "!  I'm Let's Waffle Bot, here to help you learn how to use Waffe's automation.  Let's get started!\n\nI'll create new issues :page_facing_up::page_facing_up::page_facing_up: on your Waffle board with instructions about what to do next.\n\nTo finish this card, Close this issue and look for the next issue in the To Do column."})
	    context.github.issues.createComment(userIssueComment)

	    const issue1 = context.issue({title: "Make sure Waffle Bot is setup!", body: "text text text", labels:["to do", ":runner: Let's Waffle!"]})
	    context.github.issues.create(issue1)
    }
  })
}