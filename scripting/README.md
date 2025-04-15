# Terraform Plan Validator

This script analyzes a Terraform plan JSON file to determine whether the plan should proceed based on specific criteria.

## Requirements

- Python 3.6 or higher

## Validation Rules

The script validates that:

1. The plan only contains create or modify operations (no delete operations)
2. If there are modify operations, they must ONLY modify the resource's tags attribute
3. Within the tags attribute, only the `GitCommitHash` tag can be modified
4. If anything else is being modified or added, the script will reject the plan

## Usage

```bash
python script.py <path-to-tfplan.json>
```

### Example

```bash
python script.py ./test-plans/valid-plan.tfplan.json
```

## Exit Codes

- `0`: The plan is valid and can proceed
- `1`: The plan is invalid and should not proceed

## Converting Terraform Plan to JSON

If you have a binary Terraform plan file, you can convert it to JSON using the following command:

```bash
terraform show -json <plan-file> > tfplan.json
```

## Testing

The script can be tested against the provided test plan files in the repository:

```bash
python script.py ./test-plans/valid-plan.tfplan.json
python script.py ./test-plans/invalid-plan-delete.tfplan.json
python script.py ./test-plans/invalid-plan-modify-other.tfplan.json
```