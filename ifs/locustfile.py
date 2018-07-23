from locust import Locust, TaskSet, task, HttpLocust
from users import *
import logging, sys

class MyTaskSet(TaskSet):
	email = "NULL"
	password = "NULL"


	def on_start(self):
		if len(USERS) > 0:
			self.email, self.password = USERS.pop()
			self.login()

	def login(self):
		response = self.client.post("/login", data={"username": self.email, "password":self.password})
		# logging.info('Login with %s email and %s password', self.email, self.password)

	@task(2)
	def toolUpload(self):
		with open('a4.c', 'rb') as file:

			test = self.client.post("/tool_upload", files={'files': file}, data={ 'tool-./tools/programmingTools/c_tools/programmingParser.py':
			  [ 'GCC Diagnostics',
			    'Clang Diagnostics',
			    'Code Quality Checker' ],
			 'enabled-GCC Diagnostics': 'true',
			 'opt-gccLanguageStd': 'c99',
			 'opt-gccCompilerFlags': '',
			 'opt-clangLanguageStd': 'c99',
			 'opt-clangCompilerFlags': '',
			 'opt-cppCheckErrorLevel': 'all',
			 'opt-cppCheckLanguageStd': 'c99',
			 'tool-./tools/programmingTools/c_tools/includecheck.py': '#Include Path Checker',
			 'tool-./tools/programmingTools/c_stats/stats.py': 'Statistics',
			 'tool-./tools/programmingTools/python_tools/pythonParser.py': 'Python Formatting',
			 'opt-pythonStandard': 'python3',
			 'time': '1531856360202',
			 'fileList': '["a4.c"]' })

			if test.status_code == 104:
				print(test.text)


class MyLocust(HttpLocust):
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
