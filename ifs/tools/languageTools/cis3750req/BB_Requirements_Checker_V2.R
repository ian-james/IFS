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
##############################################################################
# OVERALL NOTE ON ERRORS:
# When making changes from original script, make sure only to tell students
# that there is an error of a certain type; refrain from providing specifics.
##############################################################################
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

########################
# Identify Data Files
########################

# Set working directory (note: this may be subject to change, especially if script is adapted for moodle)
#setwd("/Users/dangillis/Dropbox/01 Academic/02 Teaching/62 CIS3750 F17 Systems Analysis & Design in Applications/CIS3750_Assignment_1_Requirements/")
#setwd("/Users/casey/Documents/UoG/Research Jobs/Gillis & Soft Design Feedback Tools/Scripts/")
getwd()
setwd("./tools/languageTools/cis3750/")

# Get list of files, pulling those for CIS3750
all.files=list.files()
all.files=all.files[substr(all.files, 1, 7)==fileName]

########################
# Expanded Dictionary
########################
okay.words=read.csv("Dictionary/CIS3750_Dictionary.csv", header = TRUE)

########################
# Assignment 1 Settings
########################
Check.Compound = TRUE
Check.Priorities = FALSE
Check.Dependencies = FALSE
Check.Time = FALSE
Check.Requirements = FALSE

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
doc = "CIS3750_A2_Requirements_Team_2.csv"
req = read.csv(doc)
#Check for error code 1 (row1, colB)
#          ref 1 (row1, colD)

errorCodes = read.csv(file="Error Codes/reqCheckerErrorCodes.csv", header=TRUE, sep=",")
class(errorCodes)

# Output Results
fileName = paste("Results/", doc, "_output_Original.txt", sep="")
file.open = file(fileName, "a")
  
###################
# CHECK COLUMN
# NAMES
###################
c.names = names(req)
c.names.test = gsub("[[:punct:]]", "", c.names)
same.names = sum(c.names==c.names.test)

if (same.names<length(c.names)) {
  #errorcode 2 (row2, colB)
  #ref 2 (row2, colD)

}

###################
# REMOVE BAD
# TEXT (note: should give formatting error if non-numeric characters are used)
###################
req$Dependencies = as.numeric(gsub("([,-])|[[:punct:]]", "", req$Dependencies))
req$Priority = as.numeric(gsub("([.-])|[[:punct:]]", "\\1", req$Priority))
req$TimeEstimate = as.numeric(gsub("([.-])|[[:punct:]]", "\\1", req$TimeEstimate))
req$ID = as.numeric(gsub("\\D+", "", req$ReqID))
#check for errorcode 3 (row3, colB)
#          ref 3 (row3, colD)

###################
# BASE REQUIREMENTS (note: give error if requirements <70, but do not tell student that 70 is the number)
###################
if (num.req<Num.Requirements.Min) {
  #errorcode 4 (row4, colB)
  #ref 4 (row4, colD)
}

# Check the IDs for duplicates (note: print message only if duplicates exist;
#don't specify which reqs are duplicates)
is.duplicate = !(length(unique(req$ID))==length(req$ID))
num.duplicates = sum(table(req$ID)>1)
duplicates = table(req$ID)
duplicates = data.frame(dup=duplicates)
duplicates = duplicates[duplicates$dup.Freq>1, ]

if (is.duplicate) {
  #errorcode 5 (row5, colB)
  #ref 5 (row5, colD)
}

# Check number requirements match the max requirements ID
num.requirements = (length(req$ID)==max(req$ID, na.rm=TRUE))

if (!num.requirements) {
  #errorcode 6 (row6, colB)
  #ref 6 (row6, colD)
}

# Check requirements for the word "and" or "And"
if (Check.Compound) {
  req$And = grepl(" and ", req$Requirement, ignore.case=TRUE)*1
  
  if (sum(req$And, na.rm=TRUE)>0) {
    #errorcode 7 (row7, colB)
    #ref 7 (row7, colD)
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
  #errorcode 8 (row8, colB)
  #ref 8 (row 8, colD)
}

# Check if extra categories are present
extra.categories.present = sum(is.na(category.labels))>0

if (extra.categories.present) {
  #errorcode 9 (row9, colB)
  #ref 9 (row 9, colD)
}

# Check if the valid categories are sorted properly
categories.sorted = (sum(sort(category.labels[!is.na(category.labels)])==category.labels[!is.na(category.labels)]))==length(category.labels[!is.na(category.labels)])

if(!categories.sorted) {
  #errorcode 10 (row10, colB)
  #ref 10 (row10, colD)
}

###################
# PRIORITIZATION
###################

# Check prioritizations are limited to 10, 20, 30, 40, 50, and NA
#(note: error messages should only state that priorities are invalid-- NO SPECIFICS!)
if (Check.Priorities) {
  priorities.valid = (sum(req$Priority%%10, na.rm=TRUE)==0) & (max(req$Priority, na.rm=TRUE)<=50)
  
  if (!priorities.valid) {
    #errorcode 11 (row11, colB)
    #ref 11 (row11, colD)
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
    #errorcode 12 (row12, colB)
    #ref 12 (row12, colD)
  }
}

# Check if 'Wont's exist, then their prioritization is set to NA
wont.priority.invalid = sum(!is.na(req$Priority[req$Category==category[4]]))>0

if (wont.priority.invalid) {
  #errorcode 13 (row13, colB)
  #ref 13 (row13, colD)
}

###################
# DEPENDENCIES
###################

# Check dependencies are logical
req$BadDep = (req$Dependencies>=req$ID)*1
req$DepPrior = NA
req$CatPrior = NA
req$BadDepPrior = NA
req$BadDepCat = NA

bad.req = req[req$BadDep==1 & !is.na(req$BadDep), ]

if (sum(req$BadDep, na.rm=TRUE)>0) {
  #errorcode 14 (row14, colB)
  #ref 14 (row14, colD)
}

# Check dependency prioritizations are valid
for (dep in 1:(length(req$ID))) {
  
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
  #errorcode 15 (row 15, colB)
  #ref 15 (row 15, colD)
}

# Check dependency categories are valid
req$CategoryLabels = match(req$Category, category)

for (dep in 1:(length(req$ID))) {
  
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
  #errorcode 16 (row16, colB)
  #ref 16 (row16, colC)
}

###################
# TIME ESTIMATES
################### 
if (Check.Time) {
  req$Long.Time = (req$TimeEstimate>Max.Req.Length)*1
  
  if (sum(req$Long.Time, na.rm=TRUE)>0) {
    #errorcode 17 (row17, colB)
    #ref 17 (row17, colD)
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
  #errorcode 18 (row18, colB)
  #ref 18 (row18, colD)
}

# Save Results
fileName = "Final_Team_Grades_Original.txt"
results.open = file(paste("Results/", fileName, sep=""), "a")
cat(GradeSummary, file=results.open)
close(results.open)