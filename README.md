Razorfish Playground
========

#### What is it ####

Razorfish playground is a place where we can access, or quickly build experiments exploring a particular technology.

### Submodules ###

If any of the tools used are git repositories from other authors, we should install them as a submodule.

To install a new submodule, Open the Terminal, go to the razorfish-playground root folder and type the following :
```
git submodule add <remote-repository.git> <local-path>
```
If you wish to just update a submodule to the latest version, please use:
```
git submodule update
```
If you wish to remove any submodule:
* Delete the relevant section from the .gitmodules file.
* Delete the relevant section from .git/config.
And run the following in the Terminal:

```
git rm --cached path_to_submodule (no trailing slash).
```
* Commit to git, and then delete the now untracked submodule files, finally on Terminal:
```
rm -rf path_to_submodule
```


### Change Log ###
