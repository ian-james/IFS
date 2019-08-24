########################
#
# Daniel Gillis &
# Casey August
# July 2019
#
# Requirements 
# Checker for CIS3750
# (adapted for student
#  usage)
########################

#######################################################################################
#NOTES FOR ERROR CHECKING (FOR REFERENCE DURING DEVELOPMENT)
#######################################################################################
# OVERALL NOTE ON ERRORS:
# When making changes from original autograder script, make sure to only tell students
# that there is an error of a certain type; refrain from providing specifics.
#######################################################################################
# SECONDARY NOTE ON ERRORS:
# If no errors are found of a particular type, the user does note need to
# be notified. Moreover, error messages will not be hard-coded, but will be
# pulled from an excel spreadsheet (i.e. a .csv) containing all error codes
#######################################################################################

########################
# Clear Memory
########################
remove(list=ls())

########################
# Required Packages
########################

#install.packages("hunspell")
library(hunspell)
library(pracma)
########################
# Set Global Variables
########################
fileName = "CIS3750"
category = c("Must", "Should", "Could", "Wont")
Iteration.Length = 10
Burn.Down.Rate = 0.8
Max.Req.Length = Iteration.Length*Burn.Down.Rate*0.5
Grade.Deduct = 2
Num.Requirements.Min = 70
Num.Requirements.To.Pull = 15
Grade.Basis = 70
use.ifs = TRUE
use.ifs.input = "PLACEHOLDER"

#############################
#IFS or client
#############################


########################
# Identify Data Files
########################

# Set working directory (note: this may be subject to change, especially if script is adapted for moodle)
# setwd("/Users/dangillis/Dropbox/01 Academic/02 Teaching/62 CIS3750 F17 Systems Analysis & Design in Applications/CIS3750_Assignment_1_Requirements/")
# setwd("/Users/casey/Documents/UoG/Research Jobs/Gillis & Soft Design Feedback Tools/Scripts/")
# setwd("./tools/languageTools/cis3750req")

########################
# Expanded Dictionary
########################
# okay.words=read.csv("Dictionary/CIS3750_Dictionary.csv", header = TRUE)
#NOTE: Need to get that dictionary file!

########################
# Assignment 1 Settings
########################
#Check.Compound = TRUE
#Check.Priorities = FALSE
#Check.Dependencies = FALSE
#Check.Time = FALSE
#Check.Requirements = FALSE

########################
# Assignment 2 Settings
########################
Check.Compound = FALSE
Check.Priorities = TRUE
Check.Dependencies = TRUE
Check.Time = TRUE
Check.Requirements = TRUE

#############################################################
# Process Files
# & Save Results
#############################################################

# Read Data (note: should give error if filename.csv does not follow naming convention)

# Create Errorlist
if(use.ifs == TRUE) {
  
  # Read in file name
  args = commandArgs(trailingOnly = TRUE)
  
  # Grab path to input file from passed argument
  userFile.path = args[1]
  userFile = basename(userFile.path)
  outputPath = normalizePath(dirname(userFile.path)) # Path to user's directory
  
  # Open output file
  outputName = paste("feedback_cis3750tool_", userFile, sep = "")
  fileName = paste(outputPath, outputName, sep = "/")
  print(fileName) 
  file.open = file(fileName, "w")
  req = read.csv(userFile.path)
  cat('{ "feedback": [ ', file = file.open, sep = "")

  okay.words = read.csv(file = "tools/languageTools/cis3750req/Dictionary/CIS3750_Dictionary.csv", header = TRUE)
  errorCodes = read.csv(file = "tools/languageTools/cis3750req/Error Codes/reqCheckerErrorCodes.csv", header=TRUE, sep=",")
} else {
  fileName = paste("Results/output_Original.txt", sep="")
  file.open = file(fileName, "w")
  userFile.path = file.choose()
  req = read.csv(userFile.path)
  userFile = basename(userFile.path)
  errorCodes = read.csv(file="Error Codes/reqCheckerErrorCodes.csv", header=TRUE, sep=",")
}

class(errorCodes)

if(grepl("CIS3750_A2_Requirements_", userFile) == FALSE) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[1]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[1]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[1]), file = file.open)
    cat(as.character(errorCodes$textBookRef[1]), file = file.open)
  }
}
  
###################
# CHECK COLUMN
# NAMES
###################
c.names = names(req)
c.names.test = gsub("[[:punct:]]", "", c.names)
same.names = sum(c.names==c.names.test)

if (same.names<length(c.names)) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[2]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[2]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[2]), file = file.open)
    cat(as.character(errorCodes$textBookRef[2]), file = file.open) 
  }
}

##################################################################################
# REMOVE BAD
# TEXT (note: should give formatting error if non-numeric characters are used)
##################################################################################
if(is.numeric(req$Dependencies) == FALSE) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[3]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[3]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[3]), file = file.open)
    cat(as.character(errorCodes$textBookRef[3]), file = file.open) 
  }
}
req$Dependencies = as.numeric(gsub("([,-])|[[:punct:]]", "", req$Dependencies))

if(is.numeric(req$Priority) == FALSE) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[3]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[3]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[3]), file = file.open)
    cat(as.character(errorCodes$textBookRef[3]), file = file.open) 
  }
}
req$Priority = as.numeric(gsub("([.-])|[[:punct:]]", "\\1", req$Priority))

if(is.numeric(req$TimeEstimate) == FALSE) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[3]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[3]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[3]), file = file.open)
    cat(as.character(errorCodes$textBookRef[3]), file = file.open) 
  }
}
req$TimeEstimate = as.numeric(gsub("([.-])|[[:punct:]]", "\\1", req$TimeEstimate))

if(is.numeric(req$ReqID) == FALSE) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[3]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[3]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[3]), file = file.open)
    cat(as.character(errorCodes$textBookRef[3]), file = file.open) 
  }
}
req$ReqID = as.numeric(gsub("\\D+", "", req$ReqID))


############################################################################################################
# BASE REQUIREMENTS (note: give error if requirements <70, but do not tell student that 70 is the number)
############################################################################################################
num.req<-length(req$ReqID)

if (num.req<Num.Requirements.Min) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[4]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[4]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[4]), file = file.open)
    cat(as.character(errorCodes$textBookRef[4]), file = file.open) 
  }
}

# Check the IDs for duplicates (note: print message only if duplicates exist;
#don't specify which reqs are duplicates)
is.duplicate = !(length(unique(req$ReqID))==length(req$ReqID))
num.duplicates = sum(table(req$ReqID)>1)
duplicates = table(req$ReqID)
duplicates = data.frame(dup=duplicates)
duplicates = duplicates[duplicates$dup.Freq>1, ]

if (is.duplicate) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[5]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[5]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[5]), file = file.open)
    cat(as.character(errorCodes$textBookRef[5]), file = file.open) 
  }
}

# Check number requirements match the max requirements ID
num.requirements = (length(req$ReqID)==max(req$ReqID, na.rm=TRUE))

if (!num.requirements) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[6]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[6]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[6]), file = file.open)
    cat(as.character(errorCodes$textBookRef[6]), file = file.open) 
  }
}

# Check requirements for the word "and" or "And"
if (Check.Compound) {
  req$And = grepl(" and ", req$Requirement, ignore.case=TRUE)*1
  
  if (sum(req$And, na.rm=TRUE)>0) {
    if(use.ifs == TRUE){
      cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
      cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"feedback": "', as.character(errorCodes$description[7]), '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"suggestions": "', as.character(errorCodes$textBookRef[7]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
    }
    else {
      cat(as.character(errorCodes$description[7]), file = file.open)
      cat(as.character(errorCodes$textBookRef[7]), file = file.open) 
    }
  }
}
###################
# CATEGORIZATION
###################

# Check categories are logically listed
category.labels = match(req$Category, category)

# Check all categories are present (note: if missing >= 1 MuSCoW categories,
#give error message /w correct spellings)
required.categories.present = sum(table(category.labels)>0)==length(category)

if (!required.categories.present) {
  temp.category = data.frame(table(category.labels))
  temp.category$category = category[temp.category$category.labels]
  temp.cats = data.frame(category=category)
  temp.category = merge(temp.category, temp.cats, by=intersect(names(temp.category), names(temp.cats)), all=TRUE)
  temp.category = temp.category[is.na(temp.category$Freq), ]

  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[8]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[8]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[8]), file = file.open)
    cat(as.character(errorCodes$textBookRef[8]), file = file.open) 
  }
}

# Check if extra categories are present
extra.categories.present = sum(is.na(category.labels))>0

if (extra.categories.present) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[9]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[9]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[9]), file = file.open)
    cat(as.character(errorCodes$textBookRef[9]), file = file.open) 
  }
}

# Check if the valid categories are sorted properly
categories.sorted = (sum(sort(category.labels[!is.na(category.labels)])==category.labels[!is.na(category.labels)]))==length(category.labels[!is.na(category.labels)])

if(!categories.sorted) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[10]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[10]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[10]), file = file.open)
    cat(as.character(errorCodes$textBookRef[10]), file = file.open) 
  }
}

###################
# PRIORITIZATION
###################

# Check prioritizations are limited to 10, 20, 30, 40, 50, and NA
#(note: error messages should only state that priorities are invalid-- NO SPECIFICS!)
if (Check.Priorities) {
  priorities.valid = (sum(req$Priority%%10, na.rm=TRUE)==0) & (max(req$Priority, na.rm=TRUE)<=50)
  
  if (!priorities.valid) {
    if(use.ifs == TRUE){
      cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
      cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"feedback": "', as.character(errorCodes$description[11]), '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"suggestions": "', as.character(errorCodes$textBookRef[11]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
    }
    else {
      cat(as.character(errorCodes$description[11]), file = file.open)
      cat(as.character(errorCodes$textBookRef[11]), file = file.open) 
    }
  }
}

# Check prioritizations are logical per categorizations
min.priority = aggregate(req$Priority[!is.na(req$Priority)], by=list(req$Category[!is.na(req$Priority)]), min)
max.priority = aggregate(req$Priority[!is.na(req$Priority)], by=list(req$Category[!is.na(req$Priority)]), max)

min.priority$order = match(min.priority$Group.1, category)
max.priority$order = match(max.priority$Group.1, category)

attach(min.priority)
priorities = data.frame(order=order, category=Group.1, min=x, max=max.priority$x)
priorities = priorities[order(order), ]
priorities$checked = 0

detach(min.priority)

# remove extra categories & missing categories
priorities = priorities[!is.na(priorities$order), ]
priorities = priorities[!is.na(priorities$min), ]
priorities = priorities[!is.na(priorities$max), ]

for (i in 2:(length(priorities$order<4))) {
  priorities$checked[i] = (priorities$min[i]>=priorities$max[i-1])*1
  if (priorities$checked[i]==0) {
    if(use.ifs == TRUE){
      cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
      cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"feedback": "', as.character(errorCodes$description[12]), '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"suggestions": "', as.character(errorCodes$textBookRef[12]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
    }
    else {
      cat(as.character(errorCodes$description[12]), file = file.open)
      cat(as.character(errorCodes$textBookRef[12]), file = file.open) 
    }
  }
}

# Check if 'Wont's exist, then their prioritization is set to NA
wont.priority.invalid = sum(!is.na(req$Priority[req$Category==category[4]]))>0

if (wont.priority.invalid) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[13]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[13]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[13]), file = file.open)
    cat(as.character(errorCodes$textBookRef[13]), file = file.open) 
  }
}

###################
# DEPENDENCIES
###################

# Check dependencies are logical
req$BadDep = (req$Dependencies>=req$ReqID)*1
req$DepPrior = NA
req$CatPrior = NA
req$BadDepPrior = NA
req$BadDepCat = NA

bad.req = req[req$BadDep==1 & !is.na(req$BadDep), ]

if (sum(req$BadDep, na.rm=TRUE)>0) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[14]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[14]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[14]), file = file.open)
    cat(as.character(errorCodes$textBookRef[14]), file = file.open) 
  }
}

# Check dependency prioritizations are valid
for (dep in 1:(length(req$ReqID))) {
  
  if (!is.na(req$Dependencies[dep])) {
    
    temp.dependency = req$Dependencies[dep]
    current.priority = req$Priority[dep]
    dependency.priority = req$Priority[temp.dependency]
    req$DepPrior[dep] = dependency.priority
    
    if (is.na(current.priority) || is.na(dependency.priority)) {
      req$BadDepPrior[dep] = 1
    }
    else {
      req$BadDepPrior[dep] = (dependency.priority>current.priority)*1
    }
  }
}

bad.prior.req = req[req$BadDepPrior==1 & !is.na(req$BadDepPrior), ]

if (sum(bad.prior.req$BadDepPrior, na.rm=TRUE)>0) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[15]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[15]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[15]), file = file.open)
    cat(as.character(errorCodes$textBookRef[15]), file = file.open) 
  }
}

# Check dependency categories are valid
req$CategoryLabels = match(req$Category, category)

for (dep in 1:(length(req$ReqID))) {
  
  if (!is.na(req$Dependencies[dep])) {
    
    temp.dependency = req$Dependencies[dep]
    current.category = req$CategoryLabels[dep]
    dependency.category = req$CategoryLabels[temp.dependency]
    req$CatPrior[dep] = category[req$Category[temp.dependency]]
    
    if (is.na(current.category) || is.na(dependency.category)) {
      req$BadDepCat[dep] = 1
    }
    else {
      req$BadDepCat[dep] = (dependency.category>current.category)*1
    }
  }
}  

bad.cat.req = req[req$BadDepCat==1 & !is.na(req$BadDepCat), ]

if (sum(bad.cat.req$BadDepCat, na.rm=TRUE)>0) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[16]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[16]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[16]), file = file.open)
    cat(as.character(errorCodes$textBookRef[16]), file = file.open) 
  }
}

###################
# TIME ESTIMATES
################### 
if (Check.Time) {
  req$Long.Time = (req$TimeEstimate>Max.Req.Length)*1
  
  if (sum(req$Long.Time, na.rm=TRUE)>0) {
    if(use.ifs == TRUE){
      cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
      cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"feedback": "', as.character(errorCodes$description[17]), '",', "\n", file = file.open, sep = "", append = TRUE)
      cat('"suggestions": "', as.character(errorCodes$textBookRef[17]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
    }
    else {
      cat(as.character(errorCodes$description[17]), file = file.open)
      cat(as.character(errorCodes$textBookRef[17]), file = file.open) 
    }
  }
}
###################
# SPELLING
###################
temp.requirements = gsub("[/]", " ", req$Requirement)
temp.requirements = gsub("[^[:alnum:]]", " ", temp.requirements)
temp.requirements = gsub("^\\x{00}-\\x{7f}]", "", temp.requirements)
checkWords = unlist(strsplit(as.character(temp.requirements), " "))
checkWords = gsub("([,-])|[[:punct:]]", "", checkWords)

incorrectSpelling = !hunspell_check(checkWords)
incorrectWords = unique(checkWords[incorrectSpelling])
incorrectWords = incorrectWords[!(incorrectWords%in%okay.words[, 1])]

if (length(incorrectWords)>0) {
  if(use.ifs == TRUE){
    cat('{"target": \"\",', '"lineNum": \"\",', '"charNum": \"\",', '"charPos": \"\",', '"severity": \"\",', '"type": \"\",', '"toolName": "reqChecker",', file = file.open, sep = "\n", append =  TRUE)
    cat('"fileName": "', userFile, '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"feedback": "', as.character(errorCodes$description[18]), '",', "\n", file = file.open, sep = "", append = TRUE)
    cat('"suggestions": "', as.character(errorCodes$textBookRef[18]), '"', "\n", "},", file = file.open, sep = "", append = TRUE)
  }
  else {
    cat(as.character(errorCodes$description[18]), file = file.open)
    cat(as.character(errorCodes$textBookRef[18]), file = file.open) 
  }
}

if(use.ifs == TRUE) {
  json.output = read.delim(fileName, header = FALSE, quote = "")
  close(file.open)
  file.open = file(fileName, "w")
  
  for(i in 1:(nrow(json.output) - 1)) {
    cat(as.character(json.output$V1[i]), "\n", file = file.open, sep = "", append = TRUE)
  }
  cat("}]", "\n", "}", "\n", file = file.open, sep = "", append = TRUE)
}

close(file.open)
