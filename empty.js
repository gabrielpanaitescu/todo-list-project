const thisWeekChecklistsDummyProject = Object.assign(Object.create(projectProto), allChecklistsDummyProject, 
{
    title: 'thisWeekChecklistsProject',
    filterThisWeekChecklists() {
        this.updateChecklistsArr();
        this.checklists = this.checklists.filter(checklist => isThisWeek(checklist.dueDate, { weekStartsOn: 1 }));
    },
});
projectsManager.dummyProjectsArr.push(thisWeekChecklistsDummyProject);