
# Run all linters
all: browserify

# Install dependencies
deps:
	@echo "$(C_CYAN)> installing dependencies$(C_RESET)"
	@npm install

browserify:
	@echo "running browserify"
	@browserify ./js/index.js >  ./build/index.js
