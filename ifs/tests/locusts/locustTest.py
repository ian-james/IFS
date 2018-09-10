#!usr/bin/python3


from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def login(self):
        self.client.post("/login", {"username":"gdouglas@uoguelph.ca", "password":"testing123"})


class WebsiteUser(HttpLocust):
    task_set = UserBehavior
