# create environment for storing handlers, schemas, and defaults
env <- new.env(hash = TRUE)

# initialise environment
env$prefix <- NULL
env$handlers <- list()
env$schemas <- list()
env$defaults <- list()
env$errors <- list()
env$types <- list()
env$types_sent <- FALSE
