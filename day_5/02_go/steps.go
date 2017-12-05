package main

import (
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

func getFileContent() []int {
	file, err := ioutil.ReadFile("../input")
	if err != nil {
		panic("Couldn't read the input file")
	}

	lines := strings.Split(string(file), "\n")
	var result []int

	for _, val := range lines {
		intVal, err := strconv.Atoi(val)
		if err != nil {
			panic("Can't read values from file")
		}

		result = append(result, intVal)
	}

	return result
}

func main() {
	numbers := getFileContent()
	steps := 0
	position := 0
	for {
		if len(numbers) <= position {
			fmt.Printf("smallest number of steps: %d", steps)
			return
		}

		oldPos := position
		position += numbers[position]
		if numbers[oldPos] >= 3 {
			numbers[oldPos] = numbers[oldPos] - 1
		} else {
			numbers[oldPos] = numbers[oldPos] + 1
		}
		steps++
	}
}
