variable "files" {
  # This variable is no longer needed for count
  # But kept for reference
  default = 5
}

# Define which files to keep (excluding index 1)
locals {
  file_indices = {
    "0" = 0
    # "1" = 1  # We're removing this one
    "2" = 2
    "3" = 3
    "4" = 4
  }
}

# Updated resource using for_each instead of count
resource "local_file" "foo" {
  for_each = local.file_indices
  content  = "# Some content for file ${each.value}"
  filename = "file${each.value}.txt"
}

# Move blocks to map resources from count to for_each
moved {
  from = local_file.foo[0]
  to   = local_file.foo["0"]
}

# No move for index 1 (we want it to be deleted)

moved {
  from = local_file.foo[2]
  to   = local_file.foo["2"]
}

moved {
  from = local_file.foo[3]
  to   = local_file.foo["3"]
}

moved {
  from = local_file.foo[4]
  to   = local_file.foo["4"]
}